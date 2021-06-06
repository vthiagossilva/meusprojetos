export interface projectEntity {
    id: string;
    nickname: string;
    finish: boolean;
    createdAt: Date;
    updatedAt: Date;
    finishAt?: Date;
    user?: string;
    sync?: boolean;
    total: number;
}

export interface categoryEntity {
    id: string;
    nickname: string;
    type: 'main' | 'step' | 'secondary';
    project: string;
    sync?: boolean;
}

export interface mainCategoriesProps {
    id: string;
    nickname: string;
}

export interface expenseEntity {
    id: string;
    description: string;
    value: number;
    pay: boolean;
    createdAt: Date;
    mainCategory: string;
    step?: string;
    secondaryCategory?: string;
    project: string;
    user?: string;
    sync?: boolean;
}
