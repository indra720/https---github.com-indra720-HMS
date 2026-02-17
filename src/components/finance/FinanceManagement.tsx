import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet,
  PieChart, BarChart3, Calculator, Target, AlertTriangle,
  Calendar, Filter, Download, Plus
} from "lucide-react";

export const FinanceManagement = () => {
  const revenueStreams = [
    { name: "Room Revenue", amount: 45280, percentage: 65, trend: "up", change: 12.5 },
    { name: "F&B Revenue", amount: 18450, percentage: 26, trend: "up", change: 8.3 },
    { name: "Spa & Services", amount: 4320, percentage: 6, trend: "down", change: -2.1 },
    { name: "Events", amount: 2150, percentage: 3, trend: "up", change: 15.2 }
  ];

  const expenses = [
    { category: "Staff Salaries", amount: 22000, budget: 25000, percentage: 88 },
    { category: "Utilities", amount: 8500, budget: 9000, percentage: 94 },
    { category: "Marketing", amount: 3200, budget: 5000, percentage: 64 },
    { category: "Maintenance", amount: 4800, budget: 6000, percentage: 80 },
    { category: "Supplies", amount: 2800, budget: 3500, percentage: 80 }
  ];

  const cashFlow = [
    { month: "Jan", inflow: 68500, outflow: 52000, net: 16500 },
    { month: "Feb", inflow: 72200, outflow: 54800, net: 17400 },
    { month: "Mar", inflow: 75800, outflow: 56200, net: 19600 },
    { month: "Apr", inflow: 79200, outflow: 58500, net: 20700 }
  ];

  const financialGoals = [
    { goal: "Increase Revenue by 15%", current: 68, target: 100, status: "on-track" },
    { goal: "Reduce Operating Costs by 8%", current: 45, target: 100, status: "behind" },
    { goal: "Improve Profit Margin to 25%", current: 78, target: 100, status: "ahead" },
    { goal: "Build Emergency Fund", current: 60, target: 100, status: "on-track" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Finance Management
          </h1>
          <p className="text-muted-foreground">Comprehensive financial overview and planning</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-800">$70,200</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.5% vs last month</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Net Profit</p>
                <p className="text-2xl font-bold text-blue-800">$18,420</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">+8.3% margin</span>
                </div>
              </div>
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Expenses</p>
                <p className="text-2xl font-bold text-orange-800">$51,780</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">-3.2% vs budget</span>
                </div>
              </div>
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Cash Flow</p>
                <p className="text-2xl font-bold text-purple-800">$19,600</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600">Positive trend</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="expenses">Expense Tracking</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Revenue Streams
              </CardTitle>
              <CardDescription>Breakdown of revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueStreams.map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{stream.name}</h3>
                        <div className="flex items-center gap-2">
                          {stream.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm ${stream.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {stream.change > 0 ? "+" : ""}{stream.change}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Progress value={stream.percentage} className="flex-1 mr-4" />
                        <span className="text-lg font-bold">${stream.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Expense Categories
              </CardTitle>
              <CardDescription>Budget vs actual expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{expense.category}</h3>
                      <Badge variant={expense.percentage > 90 ? "destructive" : expense.percentage > 80 ? "secondary" : "default"}>
                        {expense.percentage}% of budget
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        ${expense.amount.toLocaleString()} / ${expense.budget.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium">
                        ${(expense.budget - expense.amount).toLocaleString()} remaining
                      </span>
                    </div>
                    <Progress value={expense.percentage} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Cash Flow
              </CardTitle>
              <CardDescription>Inflow vs outflow analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cashFlow.map((month, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">{month.month} 2024</h3>
                      <Badge variant={month.net > 15000 ? "default" : "secondary"}>
                        Net: ${month.net.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Inflow</p>
                        <p className="font-semibold text-green-600">${month.inflow.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Outflow</p>
                        <p className="font-semibold text-red-600">${month.outflow.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Net Cash</p>
                        <p className="font-bold text-blue-600">${month.net.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Financial Goals & Targets
              </CardTitle>
              <CardDescription>Track progress towards financial objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialGoals.map((goal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">{goal.goal}</h3>
                      <Badge 
                        variant={
                          goal.status === "ahead" ? "default" : 
                          goal.status === "on-track" ? "secondary" : 
                          "destructive"
                        }
                      >
                        {goal.status === "ahead" ? "Ahead" : 
                         goal.status === "on-track" ? "On Track" : 
                         "Behind"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Progress: {goal.current}%
                      </span>
                      {goal.status === "behind" && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <Progress value={goal.current} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};