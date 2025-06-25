import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RateLimit {
  private static requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private static readonly MAX_REQUESTS = 30; // máximo de 30 requisições
  private static readonly WINDOW_MS = 60000; // janela de 1 minuto

  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const clientIp = request.ip();
    const now = Date.now();
    
    // Limpar entradas expiradas
    this.cleanExpiredEntries();
    
    const clientData = RateLimit.requestCounts.get(clientIp);
    
    if (!clientData) {
      // Primeira requisição deste IP
      RateLimit.requestCounts.set(clientIp, {
        count: 1,
        resetTime: now + RateLimit.WINDOW_MS
      });
    } else if (now > clientData.resetTime) {
      // Reset da janela de tempo
      clientData.count = 1;
      clientData.resetTime = now + RateLimit.WINDOW_MS;
    } else {
      // Incrementar contador
      clientData.count++;
      
      if (clientData.count > RateLimit.MAX_REQUESTS) {
        return response.status(429).json({
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Muitas tentativas. Tente novamente em alguns minutos.',
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        });
      }
    }

    // Adicionar headers informativos
    response.header('X-RateLimit-Limit', RateLimit.MAX_REQUESTS);
    response.header('X-RateLimit-Remaining', Math.max(0, RateLimit.MAX_REQUESTS - (clientData?.count || 0)));
    response.header('X-RateLimit-Reset', new Date(clientData?.resetTime || now + RateLimit.WINDOW_MS).toISOString());

    await next();
  }

  private cleanExpiredEntries() {
    const now = Date.now();
    for (const [ip, data] of RateLimit.requestCounts.entries()) {
      if (now > data.resetTime) {
        RateLimit.requestCounts.delete(ip);
      }
    }
  }
} 