import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  CreditCard, DollarSign, FileText, Download, Plus, Search,
  Calendar, Clock, CheckCircle, AlertCircle, XCircle,
  IndianRupee,
  X
} from "lucide-react";

interface PaymentFormData {
  customer_name: string;
  total_amount: string;    // use string for controlled inputs (easier with number inputs)
  amount_paid: string;
  due_date: string;
  notes: string;
  issued_to: string;
}
interface DashSummary {
  total_revenue: number;
  total_invoices: number;
  pending_invoices: number;
  overdue_invoices: number;
}
export const BillingModule = () => {

  const username = JSON.parse(localStorage.getItem('user'));
  const accessToken = localStorage.getItem("accessToken") || "";
  const [allSummary, setAllSummary] = useState<DashSummary>({
    total_revenue: 0,
    total_invoices: 0,
    pending_invoices: 0,
    overdue_invoices: 0,
  });

  const [AllInvoices, setAllInvoices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [Open, setOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0]; // "2025-11-18"
  const [exportDate, setExportDate] = useState({
    start_date: '',
    end_date: ''
  });

  const [ formData, setFormData] = useState<PaymentFormData>({
    customer_name: '',
    total_amount: '',
    amount_paid: '0',
    due_date: today,
    issued_to: username.full_name,
    notes: '',
  });
  //-----------------------------------------Form Handlers-----------------------------------------//
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //-----------------------------------------Export Handlers-----------------------------------------//

  const HandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExportDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const consoling = async () => {
    console.log("exportDate:", exportDate);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "overdue": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };
  //-----------------------------------------Fetch All Summary-----------------------------------------//

  const AllSummary = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/invoices/summary/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      const data = await response.json();

      setAllSummary(data);
      console.log("invoices summary:", data);
      if (response.ok) {
        // setOrders(data);
        console.log("Fetched summary:", data);
      } else {
        throw new Error(`Failed to get Summary: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error getting summary:", error);
    }

  }


  useEffect(() => {
    AllSummary();
  }, [accessToken])

  //-----------------------------------------Fetch All Invoices-----------------------------------------//
  const AllInvoice = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/invoices/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      const data = await response.json();

      setAllInvoices(data);
      console.log("invoices data:", data);
      if (response.ok) {
        // setOrders(data);
        console.log("Fetched invoices:", data);
      } else {
        throw new Error(`Failed to get invoice: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error getting invoices:", error);
    }

  }
  console.log(username.full_name)

  useEffect(() => {
    AllInvoice();
  }, [accessToken])


  //-----------------------------------------Post Invoice----------------------------------------//
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/invoices/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Placed Order:", data);
      if (response.ok) {
        // setOrders(data);
        // toast({
        //   title: "Order Placed",
        //   description: "Your order has been placed successfully.",
        //   className: "bg-emerald-600 text-white border-none shadow-lg"
        // });
        alert("Successfully")


        setFormData({
          customer_name: '',
          total_amount: '',
          issued_to: username.email,
          amount_paid: '',
          due_date: today,
          notes: '',
        })
      } else {
        throw new Error(`Failed to Place Order: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error Placing Orders:", error);
    }
    AllInvoice();
    setIsOpen(false);
  };

  //-----------------------------------------Export Invoice-----------------------------------------//
  const ExportInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    consoling();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/invoices/export/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(exportDate),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);


      if (response.ok) {
        alert("Successfully Received Exported Data");
        window.open(url);

      } else {
        throw new Error("Failed to Export Invoice");
      }

    } catch (error) {
      console.error("Error Exporting Invoices:", error);
    }
    setExportDate({
      start_date: '',
      end_date: ''
    });

    setOpen(false);
  };


  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              <div>
                <p className="text-xs md:text-sm text-green-600 font-medium">Total Revenue</p>
                <p className="text-lg md:text-2xl font-bold text-green-800">{allSummary.total_revenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <div>
                <p className="text-xs md:text-sm text-blue-600 font-medium">Invoices</p>
                <p className="text-lg md:text-2xl font-bold text-blue-800">{allSummary.total_invoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
              <div>
                <p className="text-xs md:text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-lg md:text-2xl font-bold text-yellow-800">{allSummary.pending_invoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              <div>
                <p className="text-xs md:text-sm text-red-600 font-medium">Overdue</p>
                <p className="text-lg md:text-2xl font-bold text-red-800">{allSummary.overdue_invoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
          {isOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
            >
              <div
                className="relative w-full max-w-md bg-white rounded-lg shadow-2xl p-6 max-h-screen overflow-y-auto mt-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-5 pr-10">Payment Details</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      id="total_amount"
                      name="total_amount"
                      step="0.01"
                      min="0"
                      value={formData.total_amount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="amount_paid" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      id="amount_paid"
                      name="amount_paid"
                      step="0.01"
                      min="0"
                      value={formData.amount_paid}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-sm"
                      placeholder="Add any additional notes..."
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition text-sm"
                    >
                      Save Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="relative inline-block w-full sm:w-48">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpen(!Open)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {Open && (
              <div
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40"
              />
            )}

            <div
              className={`absolute top-full mt-2 left-0 z-50 w-full sm:w-48
      transition-all duration-300 ease-out
      ${Open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}
    `}
            >
              <div
                className="relative w-full bg-white rounded-lg 
      border-2 border-gray-300 shadow-2xl shadow-black/25 p-4"
              >

                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-4 mt-6">

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded"
                      name="start_date"
                      value={exportDate.start_date}     // ← Added
                      onChange={HandleChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded"
                      name="end_date"
                      value={exportDate.end_date}       // ← Added
                      onChange={HandleChange}
                    />
                  </div>

                  <Button onClick={ExportInvoice}
                    className="w-full bg-orange-500 text-white hover:bg-orange-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>

                </div>

              </div>
            </div>
          </div>
        </div>


        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search invoices..."
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Recent Invoices</span>
          </CardTitle>
          <CardDescription>Manage and track all billing activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {AllInvoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 space-y-1 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <span className="font-semibold text-sm md:text-base">{invoice.slug.replace(/-\d{4}-/, "-")}</span>
                    <span className="text-gray-600 text-sm">{invoice.customer_name || "No Name"}</span>
                    <span className="text-gray-600 text-sm">{invoice.guest}</span>
                    <span className="text-gray-500 text-xs">
                      {invoice.items?.map(i => i.description)}
                    </span>

                  </div>
                  <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{invoice.issued_at.split("T")[0]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 mt-2 sm:mt-0">
                  <span className="font-bold text-lg">₹{invoice.total_amount}</span>
                  <Badge className={`${getStatusColor(invoice.status)} flex items-center space-x-1`}>
                    {getStatusIcon(invoice.status)}
                    <span className="capitalize">{invoice.status}</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
