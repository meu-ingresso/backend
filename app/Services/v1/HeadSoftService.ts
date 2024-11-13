import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';

export default class HeadSoftService {
  public async searchProduct(queryParam: string): Promise<any> {
    const decodedString = decodeURIComponent(queryParam);
    const cleanedString = decodedString.replace(/[^\p{L}\p{N}\s.-]/gu, '');

    try {
      const sql = `
        SELECT
          *
        FROM
          cad_Mercadoria
        WHERE
          Nome LIKE '%${cleanedString}%'
        AND
          Ativo = 1
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async searchPorts(queryParam: string): Promise<any> {
    const decodedString = decodeURIComponent(queryParam);
    const cleanedString = decodedString.replace(/[^\p{L}\p{N}\s.-]/gu, '');

    try {
      const sql = `
        SELECT
          *
        FROM
          cad_Origem_Destino
        WHERE
          Nome LIKE '%${cleanedString}%'
        AND
          Ativo = 1
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async searchCustomers(queryParam: string): Promise<any> {
    const cleanedString = decodeURIComponent(queryParam).replace(/[^\p{L}\p{N}\s.-]/gu, '');

    const normalizedCleanedString = cleanedString.replace(/[\s/.]/g, '');

    try {
      const sql = `
        SELECT
          *
        FROM
          cad_Pessoa cp
        LEFT JOIN
          cad_Cliente cc ON (cp.IdPessoa = cc.IdPessoa)
        WHERE
          REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(cp.Nome_Fantasia, '/', ''), ' ', ''), '.', ''), '-', ''), '(', '') LIKE '%${normalizedCleanedString}%'
        AND
          cp.Ativo = 1
        AND
          cc.Tipo_cliente <> 4
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getCrmData(sellersId): Promise<any> {
    const sellers = sellersId.split(',');

    let clauseWhere = '';

    for (let i = 0; i < sellers.length; i++) {
      if (i === 0) {
        clauseWhere = sellers[i];
      } else {
        clauseWhere += ` OR Cli.IdVendedor_Responsavel = ${Number(sellers[i])}`;
      }
    }

    try {
      const sql = `
        WITH BaseQuery AS
          (SELECT Cli.IdPessoa,
                  CASE
                      WHEN Cli.Tipo_Cliente = 1 THEN 'Prospect'
                      WHEN Cli.Tipo_Cliente = 2 THEN 'Cliente'
                      WHEN Cli.Tipo_Cliente = 3 THEN 'Conta declinada'
                      WHEN Cli.Tipo_Cliente = 4 THEN 'Inativo'
                      WHEN Cli.Tipo_Cliente = 5 THEN 'Trabalhando'
                      WHEN Cli.Tipo_Cliente = 6 THEN 'Conta sonho'
                      WHEN Cli.Tipo_Cliente = 7 THEN 'Agente no exterior'
                      WHEN Cli.Tipo_Cliente = 12 THEN 'Churn'
                  END AS Tipo,
                  Psa.Nome AS Cliente,
                  Psa.Nome_Fantasia AS Cliente_Fantasia,
                  Cli.IdCliente_Classificacao AS Favorito,
                  Psa.Fone AS Telefone,
                  Pgp.Nome AS Grupo,
                  Mcp.Nome AS Municipio,
                  UF.Sigla AS UF,
                  Pais.Nome AS Pais,
                  Duc.Valor_Data AS Ultimo_Contato,
                  DATEDIFF(DAY, Duc.Valor_Data, GETDATE()) AS Tempo_Ultimo_Contato,
                  Avt.Data_Visita AS Ultima_Visita,
                  DATEDIFF(DAY, Avt.Data_Visita, GETDATE()) AS Tempo_Ultima_Visita,
                  DATEDIFF(DAY, Pft.Data_Proposta, GETDATE()) AS Dias_Proposta,
                  DATEDIFF(DAY, Lhe.Data_Abertura_Processo, GETDATE()) AS Dias_Processo,
                  CPS.Nome AS Vendedor,
                  Act.Data_Contato_MAX_TUC_E_ACOMP
          FROM cad_Cliente Cli
          LEFT OUTER JOIN cad_Pessoa Psa ON Psa.IdPessoa = Cli.IdPessoa
          LEFT OUTER JOIN cad_Pessoa CPS ON CPS.IdPessoa = Cli.IdVendedor_Responsavel
          LEFT OUTER JOIN cad_Setor Seto ON Seto.IdSetor = Psa.IdSetor
          LEFT OUTER JOIN cad_Pessoa_Grupo Pgp ON Pgp.IdPessoa_Grupo = Psa.IdPessoa_Grupo
          LEFT OUTER JOIN cad_Municipio Mcp ON Mcp.IdMunicipio = Psa.IdMunicipio
          LEFT OUTER JOIN cad_Pais Pais ON Pais.IdPais = Psa.IdPais
          LEFT OUTER JOIN cad_Unidade_Federativa UF ON UF.IdUnidade_Federativa = Psa.IdUnidade_Federativa
          LEFT OUTER JOIN vis_Pessoa_Campo_Livre Duc ON Duc.IdPessoa = Cli.IdPessoa
          AND Duc.IdConfiguracao_Campo_Livre = 198
          LEFT OUTER JOIN
            (SELECT RANK() OVER(PARTITION BY IdCliente
                                ORDER BY Data_Proposta DESC, IdProposta_Frete DESC) AS Ranking,
                    IdCliente,
                    Data_Proposta
              FROM mov_Proposta_Frete Pfr) Pft ON Pft.IdCliente = Cli.IdPessoa
          AND Pft.Ranking = 1
          LEFT OUTER JOIN
            (SELECT RANK() OVER(PARTITION BY IdCliente
                                ORDER BY Data_Abertura_Processo DESC, IdLogistica_House DESC) AS Ranking,
                    IdCliente,
                    Data_Abertura_Processo
              FROM mov_Logistica_House Lhs) Lhe ON Lhe.IdCliente = Cli.IdPessoa
          AND Lhe.Ranking = 1
          LEFT OUTER JOIN
            (SELECT ROW_NUMBER() OVER(PARTITION BY IdPessoa
                ORDER BY Acm.Data DESC, IdAcompanhamento DESC) AS RowNum,
                    IdPessoa,
                    Acm.Data AS Data_Contato_MAX_TUC_E_ACOMP
              FROM cad_Pessoa_Contrato_Logistica Pcl
              LEFT OUTER JOIN mov_Acompanhamento Acm ON Acm.IdProjeto_Atividade = Pcl.IdProjeto_Atividade
              WHERE Acm.IdGrupo_Tarefa IN (2,3,6,11,45)) Act ON Act.IdPessoa = Cli.IdPessoa
          AND Act.RowNum = 1
          LEFT OUTER JOIN
            (SELECT RANK() OVER(PARTITION BY IdPessoa
                                ORDER BY Acm.Data DESC, IdAcompanhamento DESC) AS Ranking,
                    IdPessoa,
                    Acm.Data AS Data_Visita
              FROM cad_Pessoa_Contrato_Logistica Pcl
              LEFT OUTER JOIN mov_Acompanhamento Acm ON Acm.IdProjeto_Atividade = Pcl.IdProjeto_Atividade
              WHERE Acm.IdGrupo_Tarefa IN (3,6,45)) Avt ON Avt.IdPessoa = Cli.IdPessoa
          AND Avt.Ranking = 1
          WHERE Cli.Cliente = 1
            AND Cli.IdVendedor_Responsavel = ${clauseWhere})
        SELECT IdPessoa,
              Tipo,
              Cliente,
              Cliente_Fantasia,
              Favorito,
              Telefone,
              Grupo,
              Municipio,
              UF,
              Pais,
              Ultimo_Contato,
              Tempo_Ultimo_Contato,
              Ultima_Visita,
              Tempo_Ultima_Visita,
              Dias_Proposta,
              Dias_Processo,
              Decisor_Numero,
              Tuc_Id,
              Decisor,
              Tuc,
              DATEDIFF(DAY, Tuc, GETDATE()) AS Dias_Tuc,
              Uc,
              Vendedor,
              Data_Contato_MAX_TUC_E_ACOMP
        FROM
          (SELECT BaseQuery.*,
                  Ds1.Valor_Alfanumerico AS Decisor,
                  Tc1.Valor_Data AS Tuc,
                  DATEDIFF(DAY, Tc1.Valor_Data, GETDATE()) AS Uc,
                  1 AS Decisor_Numero,
                  219 AS Tuc_Id
          FROM BaseQuery
          LEFT JOIN vis_Pessoa_Campo_Livre Ds1 ON Ds1.IdPessoa = BaseQuery.IdPessoa
          AND Ds1.IdConfiguracao_Campo_Livre = 218
          LEFT JOIN vis_Pessoa_Campo_Livre Tc1 ON Tc1.IdPessoa = BaseQuery.IdPessoa
          AND Tc1.IdConfiguracao_Campo_Livre = 219
          UNION ALL SELECT BaseQuery.*,
                            Ds2.Valor_Alfanumerico AS Decisor,
                            Tc2.Valor_Data AS Tuc,
                            DATEDIFF(DAY, Tc2.Valor_Data, GETDATE()) AS Uc,
                            2 AS Decisor_Numero,
                            221 AS Tuc_Id
          FROM BaseQuery
          LEFT JOIN vis_Pessoa_Campo_Livre Ds2 ON Ds2.IdPessoa = BaseQuery.IdPessoa
          AND Ds2.IdConfiguracao_Campo_Livre = 220
          LEFT JOIN vis_Pessoa_Campo_Livre Tc2 ON Tc2.IdPessoa = BaseQuery.IdPessoa
          AND Tc2.IdConfiguracao_Campo_Livre = 221
          UNION ALL SELECT BaseQuery.*,
                            Ds3.Valor_Alfanumerico AS Decisor,
                            Tc3.Valor_Data AS Tuc,
                            DATEDIFF(DAY, Tc3.Valor_Data, GETDATE()) AS Uc,
                            3 AS Decisor_Numero,
                            223 AS Tuc_Id
          FROM BaseQuery
          LEFT JOIN vis_Pessoa_Campo_Livre Ds3 ON Ds3.IdPessoa = BaseQuery.IdPessoa
          AND Ds3.IdConfiguracao_Campo_Livre = 222
          LEFT JOIN vis_Pessoa_Campo_Livre Tc3 ON Tc3.IdPessoa = BaseQuery.IdPessoa
          AND Tc3.IdConfiguracao_Campo_Livre = 223
          UNION ALL SELECT BaseQuery.*,
                            Ds4.Valor_Alfanumerico AS Decisor,
                            Tc4.Valor_Data AS Tuc,
                            DATEDIFF(DAY, Tc4.Valor_Data, GETDATE()) AS Uc,
                            4 AS Decisor_Numero,
                            225 AS Tuc_Id
          FROM BaseQuery
          LEFT JOIN vis_Pessoa_Campo_Livre Ds4 ON Ds4.IdPessoa = BaseQuery.IdPessoa
          AND Ds4.IdConfiguracao_Campo_Livre = 224
          LEFT JOIN vis_Pessoa_Campo_Livre Tc4 ON Tc4.IdPessoa = BaseQuery.IdPessoa
          AND Tc4.IdConfiguracao_Campo_Livre = 225
          UNION ALL SELECT BaseQuery.*,
                            Ds5.Valor_Alfanumerico AS Decisor,
                            Tc5.Valor_Data AS Tuc,
                            DATEDIFF(DAY, Tc5.Valor_Data, GETDATE()) AS Uc,
                            5 AS Decisor_Numero,
                            227 AS Tuc_Id
          FROM BaseQuery
          LEFT JOIN vis_Pessoa_Campo_Livre Ds5 ON Ds5.IdPessoa = BaseQuery.IdPessoa
          AND Ds5.IdConfiguracao_Campo_Livre = 226
          LEFT JOIN vis_Pessoa_Campo_Livre Tc5 ON Tc5.IdPessoa = BaseQuery.IdPessoa
          AND Tc5.IdConfiguracao_Campo_Livre = 227
          UNION ALL SELECT BaseQuery.*,
                            Ds6.Valor_Alfanumerico AS Decisor,
                            Tc6.Valor_Data AS Tuc,
                            DATEDIFF(DAY, Tc6.Valor_Data, GETDATE()) AS Uc,
                            6 AS Decisor_Numero,
                            229 AS Tuc_Id
          FROM BaseQuery
          LEFT JOIN vis_Pessoa_Campo_Livre Ds6 ON Ds6.IdPessoa = BaseQuery.IdPessoa
          AND Ds6.IdConfiguracao_Campo_Livre = 228
          LEFT JOIN vis_Pessoa_Campo_Livre Tc6 ON Tc6.IdPessoa = BaseQuery.IdPessoa
          AND Tc6.IdConfiguracao_Campo_Livre = 229) AS FinalQuery
        WHERE Decisor IS NOT NULL
        ORDER BY Cliente_Fantasia ASC, Dias_Tuc DESC;
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getCustomerData(customerId): Promise<any> {
    try {
      const sql = `
        SELECT
          *
        FROM
          cad_pessoa cp
        LEFT JOIN
          cad_cliente cc
        ON
          (cp.IdPessoa = cc.IdPessoa)
        WHERE
          cp.IdPessoa = ${customerId}
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getCustomerTotalizer(customerId): Promise<any> {
    try {
      const sql = `
        SELECT
        -- Total de processos
        (
            SELECT COUNT(vbp2.Numero_Processo)
            FROM vis_bi_processo vbp2
            LEFT JOIN mov_Logistica_House mlh2 ON mlh2.IdLogistica_House = vbp2.IdLogistica_House
            WHERE vbp2.Situcao_Agenciamento NOT IN ('Cancelado')
            AND vbp2.Demurrage_Detention = '0'
            AND mlh2.IdCliente = ${customerId}
            AND vbp2.Cliente = vbp.Cliente
            AND vbp2.Tipo_Operacao = vbp.Tipo_Operacao
        ) AS Total_Processos,
        -- Total de TEUs
        (
            SELECT SUM(vbp2.Total_TEUS)
            FROM vis_bi_processo vbp2
            LEFT JOIN mov_Logistica_House mlh2 ON mlh2.IdLogistica_House = vbp2.IdLogistica_House
            WHERE vbp2.Situcao_Agenciamento NOT IN ('Cancelado')
            AND vbp2.Demurrage_Detention = '0'
            AND vbp2.Modalidade_Processo = 'Marítimo'
            AND vbp2.Total_TEUS > 0
            AND mlh2.IdCliente = ${customerId}
            AND vbp2.Cliente = vbp.Cliente
            AND vbp2.Tipo_Operacao = vbp.Tipo_Operacao
        ) AS Total_TEUS,
        -- Total de Toneladas
        (
            SELECT SUM(vbp2.Peso_Taxado_House)
            FROM vis_bi_processo vbp2
            LEFT JOIN mov_Logistica_House mlh2 ON mlh2.IdLogistica_House = vbp2.IdLogistica_House
            WHERE vbp2.Situcao_Agenciamento NOT IN ('Cancelado')
            AND vbp2.Demurrage_Detention = '0'
            AND vbp2.Modalidade_Processo = 'Aéreo'
            AND vbp2.Peso_Taxado_House IS NOT NULL
            AND mlh2.IdCliente = ${customerId}
            AND vbp2.Cliente = vbp.Cliente
            AND vbp2.Tipo_Operacao = vbp.Tipo_Operacao
        ) AS Total_Tons
    FROM
        vis_bi_processo vbp
    LEFT JOIN
        mov_Logistica_House mlh ON mlh.IdLogistica_House = vbp.IdLogistica_House
    WHERE
        mlh.IdCliente = ${customerId}
    GROUP BY
        vbp.Cliente,
        vbp.Tipo_Operacao,
        mlh.IdCliente;
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getCustomerApproval(customerId): Promise<any> {
    try {
      const sql = `
        SELECT
          vbc.Situacao_Oferta,
          COUNT(*) AS Total_Propostas
        FROM
          vis_bi_comercial vbc
        LEFT JOIN
          mov_Proposta_Frete mpf ON mpf.idProposta_Frete = vbc.idProposta_Frete
        WHERE
          mpf.IdCliente = ${customerId}
        GROUP BY
          mpf.IdCliente,
          vbc.Cliente,
          vbc.Situacao_Oferta
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getCustomerContacts(customerId): Promise<any> {
    try {
      const sql = `
       SELECT
        p.IdPessoa,
        UPPER(p.Nome) AS Cliente,
        UPPER(cpc.nome) AS Contato,
        UPPER(cs.Nome) AS Setor,
        UPPER(cc.Nome) AS Cargo,
        cpc.Fone AS Telefone,
        UPPER(cpc.EMail) AS Email
      FROM
        cad_pessoa_contato cpc
      LEFT JOIN
        cad_Pessoa p ON cpc.IdPessoa = p.IdPessoa
      LEFT JOIN
        cad_setor cs ON cs.IdSetor = cpc.IdSetor
      LEFT JOIN
        cad_cargo cc ON cc.IdCargo = cpc.IdCargo
      WHERE
        p.IdPessoa = ${customerId}
      ORDER BY
        Contato asc
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getCustomerFollowUps(customerId): Promise<any> {
    try {
      const sql = `
       SELECT TOP 6
          FORMAT(Acm.Data, 'dd/MM/yyyy') AS Data_Formatada,
          Acm.IdResponsavel,
          Acm.IdAcompanhamento,
          Res.Nome AS Responsavel_Acm,
          Vnd.Nome AS Vendedor,
          Cli.Nome,
          Cli.Nome_Fantasia,
          gpt.Nome AS Grupo_Tarefa,
          Acm.IdProjeto_Atividade,
          LhsAcm.IdPessoa_Contrato_Logistica,
          Acm.Titulo,
          Acm.Descricao
      FROM
          mov_Acompanhamento Acm
      JOIN
          cad_Pessoa_Contrato_Logistica LhsAcm ON Acm.IdProjeto_Atividade = LhsAcm.IdProjeto_Atividade
      LEFT OUTER JOIN
          vis_Cliente Cli ON Cli.IdPessoa = LhsAcm.IdPessoa
      LEFT OUTER JOIN
          cad_Pessoa Vnd ON Vnd.IdPessoa = Cli.IdVendedor_Responsavel
      LEFT OUTER JOIN
          cad_Pessoa Res ON Res.IdPessoa = Acm.IdResponsavel
      LEFT OUTER JOIN
          cad_Grupo_Tarefa gpt ON gpt.IdGrupo_Tarefa = Acm.IdGrupo_Tarefa
      WHERE
          gpt.Nome IS NOT NULL
          AND Cli.IdPessoa = ${customerId}
      ORDER BY
        Acm.Data DESC
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getGroupTask(): Promise<any> {
    try {
      const sql = `
        SELECT
          IdGrupo_Tarefa AS id,
          Nome AS name
        FROM
          cad_Grupo_Tarefa
        WHERE
          Codigo <> 'INATIVADA'
        ORDER BY
          Nome ASC
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getLogisticContract(customerId): Promise<any> {
    try {
      const sql = `
        SELECT
          *
        FROM
          cad_Pessoa_Contrato_Logistica
        WHERE
          IdPessoa = ${customerId}
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getEnterpriseSystem(): Promise<any> {
    try {
      const sql = `
        SELECT
          IdEmpresa_Sistema AS id,
          Nome AS name
        FROM
          sys_Empresa_Sistema
        WHERE
          Ativo = 1
        ORDER BY
          id ASC
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async getLastFollowUp(): Promise<any> {
    try {
      const sql = `
        SELECT TOP 1
          IdAcompanhamento AS id
        FROM
          mov_Acompanhamento
        ORDER BY
          id DESC
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async createNewFollowUp(payload): Promise<any> {
    const dataFormatada =
      payload.Data instanceof DateTime
        ? payload.Data.toFormat('yyyy-MM-dd HH:mm:ss.SSS')
        : DateTime.fromISO(payload.Data).toFormat('yyyy-MM-dd HH:mm:ss.SSS');

    try {
      const result = await Database.connection('sqlserver')
        .table('mov_acompanhamento')
        .insert({
          idacompanhamento: payload.IdAcompanhamento,
          idresponsavel: Number(payload.IdResponsavel),
          idgrupo_tarefa: payload.IdGrupo_Tarefa,
          idempresa_sistema: payload.IdEmpresa_Sistema,
          idprojeto_atividade: payload.IdProjeto_Atividade,
          descricao: payload.Descricao,
          data: dataFormatada,
          tipo: payload.Tipo,
          titulo: payload.Titulo,
        });

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async updateFollowUp(payload): Promise<any> {
    try {
      const sql = `
        UPDATE
          mov_Acompanhamento SET Descricao = '${payload.Descricao}'
        WHERE
          IdAcompanhamento = ${payload.IdAcompanhamento}
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async updateCrmData(payload): Promise<any> {
    try {
      const formattedDate = payload.Tuc.toISOString().slice(0, 19);

      const sql = `
        UPDATE
          vis_Pessoa_Campo_Livre SET Valor_Data = '${formattedDate}'
        FROM
          cad_Cliente Cli
        LEFT OUTER JOIN
          vis_Pessoa_Campo_Livre Tc${payload.Decisor_Numero} ON Tc${payload.Decisor_Numero}.IdPessoa = Cli.IdPessoa AND Tc${payload.Decisor_Numero}.IdConfiguracao_Campo_Livre = ${payload.IdConfiguracao_Campo_Livre}
        WHERE
          Cli.IdPessoa = ${payload.IdPessoa}
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async updateFav(payload): Promise<any> {
    try {
      const sql = `
        UPDATE
          cad_cliente SET IdCliente_Classificacao = ${payload.Favorito}
        WHERE
          IdPessoa = ${payload.IdPessoa}
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      return result;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }
}
