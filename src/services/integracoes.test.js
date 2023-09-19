import api from './api';
import { buscaTransacoes } from './transacoes';

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

const mockRequisaoErro = (retorno) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject();
      }, 200);
    });
  };

describe('Requisicoes para API', () => {
    test('Deve retornar uma lista de transacoes', async ()=>{
        api.get.mockImplementation(()=>mockRequisao(mockTransacao))

        const transacoes = await buscaTransacoes()
        expect(transacoes).toEqual(mockTransacao)

        expect(api.get).toHaveBeenCalledWith('/transacoes')
    })

    test('Deve retornar uma lista de vazia quando a requisao falhar', async ()=>{
        api.get.mockImplementation(()=>mockRequisaoErro())

        const transacoes = await buscaTransacoes()
        expect(transacoes).toEqual([])

        expect(api.get).toHaveBeenCalledWith('/transacoes')
    })

});
