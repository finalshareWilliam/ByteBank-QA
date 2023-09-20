import api from './api';
import { buscaTransacoes, salvaTransacao } from './transacoes';

jest.mock('./api');
const mockTransacao = [
  {
    id: 1,
    transacao: 'Depósito',
    valor: '100',
    data: '22/11/2022',
    mes: 'Novembro',
  },
];

const mockRequisao = (retorno) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: retorno,
      });
    }, 200);
  });
};

const mockRequisaoPost = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 201,
      });
    }, 200);
  });
};

const mockRequisaoPostErro = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject();
    }, 200);
  });
};

const mockRequisaoErro = (retorno) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject();
    }, 200);
  });
};

describe('Requisicoes para API', () => {
  test('Deve retornar uma lista de transacoes', async () => {
    api.get.mockImplementation(() => mockRequisao(mockTransacao));

    const transacoes = await buscaTransacoes();
    expect(transacoes).toEqual(mockTransacao);

    expect(api.get).toHaveBeenCalledWith('/transacoes');
  });

  test('Deve retornar uma lista de vazia quando a requisao falhar', async () => {
    api.get.mockImplementation(() => mockRequisaoErro());

    const transacoes = await buscaTransacoes();
    expect(transacoes).toEqual([]);

    expect(api.get).toHaveBeenCalledWith('/transacoes');
  });

  test('Deve retornar um status 201 - Created apos uma requisicao POST', async () =>{
    api.post.mockImplementation(()=> mockRequisaoPost())
    const status = await salvaTransacao(mockTransacao[0])
    expect(status).toBe(201)
    expect(api.post).toHaveBeenCalledWith('/transacoes', mockTransacao[0])
  })

  test('Deve retornar um saldo de 1000 quando a requisao post falhar', async () => {
    api.get.mockImplementation(() => mockRequisaoPostErro());

    const status = await salvaTransacao(mockTransacao[0])
    expect(status).toBe('Erro na requisição')
    expect(api.post).toHaveBeenCalledWith('/transacoes', mockTransacao[0])
  });
});
