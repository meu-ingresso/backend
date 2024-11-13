import DataAccessService from './DataAccessService';
import Database from '@ioc:Adonis/Lucid/Database';
import Nps from 'App/Models/Access/Nps';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class NpsService {
  private dataAccessService = new DataAccessService<typeof Nps>(Nps);

  public async create(record: Record<string, any>): Promise<Nps> {
    let nps: Nps = new Nps().fill(record);

    await Database.transaction(async (trx) => {
      nps.useTransaction(trx);

      await nps.save();
    });

    return nps;
  }

  public async update(record: Record<string, any>): Promise<Nps> {
    let nps: Nps = await Nps.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      nps.useTransaction(trx);

      nps.merge({ ...record });

      await nps.save();
    });
    return nps;
  }

  public async generateEmailData() {
    try {
      const sql = `
        WITH RankedProcesses AS (
          SELECT
            Psa.Nome,
            Psa.EMail,
            p.Cpf_Cnpj,
            p.Nome_Fantasia,
            mlh.Numero_Processo,
            mlh.Referencia_Cliente,
            mlh.Data_Fechamento_Processo,
            co.Nome as Origem,
            cd.Nome as Destino,
            ROW_NUMBER() OVER (
              PARTITION BY p.Cpf_Cnpj
              ORDER BY mlh.Data_Fechamento_Processo DESC
            ) AS RowNum
          FROM
            mov_Logistica_House mlh
          LEFT JOIN
            mov_Projeto_Atividade_Contato Pac ON Pac.IdProjeto_Atividade = mlh.IdProjeto_Atividade
          LEFT JOIN
            cad_Pessoa_Contato Psa ON Psa.IdPessoa_Contato = Pac.IdPessoa_Contato
          LEFT JOIN
            mov_Logistica_Master mlm ON mlm.IdLogistica_Master = mlh.IdLogistica_Master
          LEFT JOIN
            cad_Pessoa p ON Psa.IdPessoa = p.IdPessoa
          LEFT JOIN
            cad_Origem_Destino co ON co.IdOrigem_Destino = mlm.idOrigem
          LEFT JOIN
            cad_Origem_Destino cd ON cd.IdOrigem_Destino = mlm.idDestino
          WHERE
            mlh.Agenciamento_Carga = 1
            AND Psa.Email IS NOT NULL
            AND Psa.Email <> ''
            AND Psa.Email <> ';'
            AND Psa.Email <> '.'
            AND MONTH(mlh.Data_Fechamento_Processo) = MONTH(DATEADD(MONTH, -1, GETDATE()))
            AND YEAR(mlh.Data_Fechamento_Processo) = YEAR(DATEADD(MONTH, -1, GETDATE()))
            AND p.Cpf_Cnpj IS NOT NULL
            AND p.Cpf_Cnpj <> ''
			      AND mlh.IdCliente = p.IdPessoa
        )
        SELECT
          Nome,
          EMail,
          Cpf_Cnpj,
          Nome_Fantasia,
          Numero_Processo,
          Referencia_Cliente,
          Origem,
          Destino
        FROM
          RankedProcesses
        WHERE
          RowNum <= 5
        ORDER BY
          Data_Fechamento_Processo ASC;
      `;

      const result = await Database.connection('sqlserver').rawQuery(sql);

      const groupedData = result.reduce((acc, item) => {
        let company = acc.find((el) => el.Cpf_Cnpj === item.Cpf_Cnpj && el.Nome_Fantasia === item.Nome_Fantasia);

        const process: { process_number: string; external_reference?: string; origem: string; destino: string } = {
          process_number: item.Numero_Processo,
          origem: item.Origem,
          destino: item.Destino,
        };

        if (item.Referencia_Cliente && item.Referencia_Cliente !== '') {
          process.external_reference = item.Referencia_Cliente;
        }

        const contact = {
          name: item.Nome,
          email: item.EMail,
        };

        if (company) {
          const processExists = company.processes.some((p) => p.process_number === process.process_number);
          if (!processExists) {
            company.processes.push(process);
          }

          const contatoExiste = company.contacts.some((c) => c.name === contact.name && c.email === contact.email);
          if (!contatoExiste) {
            company.contacts.push(contact);
          }
        } else {
          company = {
            Nome_Fantasia: item.Nome_Fantasia,
            Cpf_Cnpj: item.Cpf_Cnpj,
            processes: [process],
            contacts: [contact],
          };
          acc.push(company);
        }

        return acc;
      }, []);

      const cleanData = groupedData.map((company) => {
        return {
          ...company,
          processes: company.processes.map((process) => ({
            ...process,
            process_number: process.process_number.trim().replace(/\s+/g, ' '),
          })),
          contacts: company.contacts.map((contact) => ({
            name: contact.name.trim().replace(/\s+/g, ' '),
            email: contact.email.trim().replace(/\s+/g, ' '),
          })),
        };
      });

      return cleanData;
    } catch (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      throw err;
    }
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }

  public async calculateNps(): Promise<{ satisfactionAverage: number; recommendationAverage: number }> {
    const totalRecords = await Nps.query().count('* as total');
    const count = totalRecords[0].$extras.total;

    if (count === 0) {
      return {
        satisfactionAverage: 0,
        recommendationAverage: 0,
      };
    }

    const satisfactionSum = await Nps.query().sum('satisfaction as totalSatisfaction');
    const recommendationSum = await Nps.query().sum('recommendation as totalRecommendation');

    const satisfactionAverage = parseFloat((satisfactionSum[0].$extras.totalSatisfaction / count).toFixed(2));
    const recommendationAverage = parseFloat((recommendationSum[0].$extras.totalRecommendation / count).toFixed(2));

    return {
      satisfactionAverage,
      recommendationAverage,
    };
  }
}
