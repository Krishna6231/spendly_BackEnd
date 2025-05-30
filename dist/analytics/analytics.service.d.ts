export declare class AnalyticsService {
    getAnalyticsByUserId(userid: string): Promise<{
        totalSpent: number;
        topCategory: {
            category: string;
            amount: number;
        };
        leastCategory: {
            category: string;
            amount: number;
        };
        averageDailyExpense: number;
        dailyExpenses: {
            date: string;
            amount: number;
        }[];
        monthlyCategoryExpenses: Record<string, Record<string, number>>;
    }>;
}
