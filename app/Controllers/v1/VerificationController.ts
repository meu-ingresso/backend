import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import {
  VerifyEmailValidator,
  ForgotPasswordValidator,
  ResetPasswordValidator,
  ResendVerificationValidator,
} from 'App/Validators/v1/VerificationValidator';
import VerificationService from 'App/Services/v1/VerificationService';
import utils from 'Utils/utils';
import User from 'App/Models/Access/Users';

export default class VerificationController {
  private verificationService = new VerificationService();

  public async verifyEmail(context: HttpContextContract) {
    const { token, email } = await context.request.validate(VerifyEmailValidator);

    const user = await this.verificationService.verifyEmail(token, email);

    if (!user) {
      return utils.handleError(context, 400, 'INVALID_TOKEN', 'Token inválido ou expirado');
    }

    utils.createAudity(
      'EMAIL_VERIFIED',
      'USER',
      user.id,
      user.id,
      { account_verified: false },
      { account_verified: true }
    );

    return utils.handleSuccess(context, { message: 'Email verificado com sucesso!' }, 'EMAIL_VERIFIED', 200);
  }

  public async forgotPassword(context: HttpContextContract) {
    const { email } = await context.request.validate(ForgotPasswordValidator);

    this.verificationService.createPasswordResetToken(email);

    return utils.handleSuccess(
      context,
      { message: 'Se o email existir em nosso sistema, você receberá instruções de recuperação.' },
      'PASSWORD_RESET_EMAIL_SENT',
      200
    );
  }

  public async resetPassword(context: HttpContextContract) {
    const { token, email, password } = await context.request.validate(ResetPasswordValidator);

    const user = await this.verificationService.resetPassword(token, email, password);

    if (!user) {
      return utils.handleError(context, 400, 'INVALID_TOKEN', 'Token inválido ou expirado');
    }

    utils.createAudity('PASSWORD_RESET', 'USER', user.id, user.id, {}, { password_changed: true });

    return utils.handleSuccess(context, { message: 'Senha alterada com sucesso!' }, 'PASSWORD_RESET', 200);
  }

  public async resendVerification(context: HttpContextContract) {
    const { email } = await context.request.validate(ResendVerificationValidator);

    const user = await User.query().where('email', email).whereNull('deleted_at').first();

    if (!user) {
      return utils.handleSuccess(
        context,
        { message: 'Se o email existir em nosso sistema e não estiver verificado, você receberá um novo email.' },
        'VERIFICATION_EMAIL_SENT',
        200
      );
    }

    const sent = await this.verificationService.resendVerificationEmail(user.id);

    if (!sent) {
      return utils.handleError(context, 400, 'ALREADY_VERIFIED', 'Este email já foi verificado');
    }

    return utils.handleSuccess(
      context,
      { message: 'Email de verificação reenviado com sucesso!' },
      'VERIFICATION_EMAIL_SENT',
      200
    );
  }
}
