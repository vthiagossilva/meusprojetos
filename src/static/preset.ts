interface presets {
    [key: string]: { [key: string]: string[] };
}

export const PRESETS: presets = {
    construcao: {
        main: [
            'Material',
            'Mão de obra',
            'Serviço'
        ],
        step: [
            'Regulamentação',
            'Fundação',
            'Paredes',
            'Cobertura',
            'Acabamentos'
        ]
    },
    casamento: {
        main: [
            'Moradia',
            'Móvel ou Eletrodoméstico',
            'Vestuário',
            'Festa'
        ],
        step: [
            'Bens de consumo',
            'Aluguéis',
            'Contrato de serviço'
        ]
    },
    festa: {
        main: [
            'Local',
            'Decoração',
            'Comida ou bebida'
        ],
        step: [
            'Bens de consumo',
            'Aluguéis',
            'Contrato de serviço'
        ]
    },
    negocio: {
        main: [
            'Ponto comercial',
            'Serviço',
            'Colaborador',
            'Fornecedor'
        ],
        step: [
            'Regulamentação',
            'Impostos',
            'Bens de consumo',
            'Aluguéis',
            'Contrato de serviço'
        ]
    }
}
