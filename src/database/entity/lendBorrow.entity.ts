export interface LendBorrowEntity {
  id: string;
  user_id: string;
  name: string;
  date: string;
  type: 'lent' | 'borrow';
  amount: number;
  installment: { amount: number; date: string }[];
}
