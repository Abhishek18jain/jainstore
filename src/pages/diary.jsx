import React, { useEffect, useMemo, useState } from "react";

/**
 * DairyPage.jsx
 * - Tailwind CSS required
 * - Drop into your React app
 */

/* Mock initial data (ISO dates) */
const initialTransactions = [
  {
    id: 1,
    customerName: "Ramesh Kumar",
    type: "taken",
    amount: 50,
    description: "1kg Sugar",
    date: new Date().toISOString(),
  },
  {
    id: 2,
    customerName: "Sita Devi",
    type: "taken",
    amount: 25,
    description: "Parle-G & Milk",
    date: new Date().toISOString(),
  },
  {
    id: 3,
    customerName: "Ramesh Kumar",
    type: "given",
    amount: 30,
    description: "Paid cash",
    date: new Date().toISOString(),
  },
];

const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`;
const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const emptyEntry = {
  customerName: "",
  amount: "",
  type: "taken",
  description: "",
};

const DairyPage = () => {
  // Load + migrate localStorage (if older format used plain strings, keep safe)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("dairyTransactions");
      if (!saved) return initialTransactions;
      const parsed = JSON.parse(saved);

      // If some entries have date as locale string, convert to ISO now
      const migrated = parsed.map((t, i) => {
        if (!t.date) t.date = new Date().toISOString();
        // if looks like non-ISO, try to parse and convert to ISO
        if (isNaN(Date.parse(t.date))) {
          // fallback: set now
          t.date = new Date().toISOString();
        } else {
          // ensure it's in ISO string format
          t.date = new Date(t.date).toISOString();
        }
        // ensure amount numeric
        t.amount = Number(t.amount) || 0;
        if (!t.id) t.id = Date.now() + i;
        return t;
      });
      return migrated;
    } catch (e) {
      console.error("Failed parsing saved transactions:", e);
      return initialTransactions;
    }
  });

  useEffect(() => {
    localStorage.setItem("dairyTransactions", JSON.stringify(transactions));
  }, [transactions]);

  // Forms & modals
  const [newEntry, setNewEntry] = useState(emptyEntry);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentCustomer, setPaymentCustomer] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // UI: search & filter
  const [query, setQuery] = useState("");
  const [showOnlyWithDue, setShowOnlyWithDue] = useState(false);

  // Derived: customers list & totals
  const customerTotals = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      if (!totals[t.customerName]) totals[t.customerName] = 0;
      totals[t.customerName] += t.type === "taken" ? t.amount : -t.amount;
    });
    return totals;
  }, [transactions]);

  // Add new entry
  const handleNewChange = (e) => {
    const { name, value, type } = e.target;
    setNewEntry((p) => ({ ...p, [name]: type === "number" ? value : value }));
  };

  const handleAddEntry = (e) => {
    e?.preventDefault();
    if (!newEntry.customerName.trim() || !newEntry.amount || !newEntry.description.trim()) {
      alert("Please fill all fields for new entry.");
      return;
    }
    const tx = {
      id: Date.now(),
      ...newEntry,
      amount: parseFloat(newEntry.amount),
      date: new Date().toISOString(),
    };
    setTransactions((p) => [...p, tx]);
    setNewEntry(emptyEntry);
  };

  // Payment modal
  const openPaymentModal = (customerName) => {
    setPaymentCustomer(customerName);
    setPaymentAmount("");
    setIsPaymentOpen(true);
  };
  const closePaymentModal = () => {
    setIsPaymentOpen(false);
    setPaymentCustomer("");
    setPaymentAmount("");
  };
  const handleSavePayment = () => {
    const amt = parseFloat(paymentAmount);
    if (!paymentCustomer || isNaN(amt) || amt <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }
    const tx = {
      id: Date.now(),
      customerName: paymentCustomer,
      amount: amt,
      type: "given",
      description: "Payment Received",
      date: new Date().toISOString(),
    };
    setTransactions((p) => [...p, tx]);
    closePaymentModal();
  };

  // Edit flow
  const openEdit = (tx) => {
    setEditingEntry({ ...tx });
    setIsEditOpen(true);
  };
  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingEntry(null);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEntry((p) => ({ ...p, [name]: value }));
  };
  const saveEdit = () => {
    if (!editingEntry.customerName || !editingEntry.amount || !editingEntry.description) {
      alert("Please fill all fields in edit.");
      return;
    }
    setTransactions((p) =>
      p.map((t) => (t.id === editingEntry.id ? { ...editingEntry, amount: parseFloat(editingEntry.amount), date: editingEntry.date || new Date().toISOString() } : t))
    );
    closeEdit();
  };

  // Delete flow
  const confirmDelete = (id) => {
    setToDeleteId(id);
    setIsDeleteOpen(true);
  };
  const doDelete = () => {
    setTransactions((p) => p.filter((t) => t.id !== toDeleteId));
    setIsDeleteOpen(false);
    setToDeleteId(null);
  };

  // Filtering transactions for display
  const filteredTransactions = useMemo(() => {
    const q = query.trim().toLowerCase();
    let txs = [...transactions];
    // sort by date ascending for running totals (oldest first)
    txs.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (q) {
      txs = txs.filter((t) => t.customerName.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (showOnlyWithDue) {
      // include only transactions for customers whose current total > 0 (customer owes)
      const owing = new Set(Object.entries(customerTotals).filter(([_, v]) => v > 0).map(([name]) => name));
      txs = txs.filter((t) => owing.has(t.customerName));
    }
    return txs;
  }, [transactions, query, showOnlyWithDue, customerTotals]);

  // Build table rows with running totals per customer
  const rowsWithRunning = useMemo(() => {
    const running = {};
    return filteredTransactions.map((t) => {
      if (running[t.customerName] === undefined) running[t.customerName] = 0;
      running[t.customerName] += t.type === "taken" ? t.amount : -t.amount;
      return { ...t, runningTotal: running[t.customerName] };
    });
  }, [filteredTransactions]);

  // Responsive: show card view on small screens
  // Helper: distinct customers sorted alphabetically
  const customersSorted = useMemo(() => Object.keys(customerTotals).sort((a, b) => a.localeCompare(b)), [customerTotals]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customer Dairy</h1>
          <div className="flex gap-2 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer or desc..."
              className="w-56 md:w-72 px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showOnlyWithDue} onChange={(e) => setShowOnlyWithDue(e.target.checked)} />
              Only customers with due
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Add entry + Totals */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Add New Entry</h2>
              <form onSubmit={handleAddEntry} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input name="customerName" value={newEntry.customerName} onChange={handleNewChange} className="mt-1 w-full px-3 py-2 border rounded" placeholder="e.g., Ramesh Kumar" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input name="amount" value={newEntry.amount} onChange={handleNewChange} type="number" className="mt-1 w-full px-3 py-2 border rounded" placeholder="e.g., 50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <div className="mt-2 flex gap-4 items-center">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="type" value="taken" checked={newEntry.type === "taken"} onChange={handleNewChange} />
                      लिया (Owed)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="type" value="given" checked={newEntry.type === "given"} onChange={handleNewChange} />
                      दिया (Paid)
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" value={newEntry.description} onChange={handleNewChange} rows="2" className="mt-1 w-full px-3 py-2 border rounded" placeholder="e.g., 1kg Sugar" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition">Add Entry</button>
                  <button type="button" onClick={() => setNewEntry(emptyEntry)} className="bg-gray-200 py-2 px-3 rounded hover:bg-gray-300">Clear</button>
                </div>
              </form>
            </section>

            <section className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Total Due / Advance</h2>
              <div className="space-y-2 max-h-64 overflow-auto">
                {customersSorted.length === 0 && <p className="text-sm text-gray-500">No customers yet</p>}
                {customersSorted.map((name) => {
                  const total = customerTotals[name];
                  return (
                    <div key={name} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-gray-500">{total > 0 ? "Due" : total < 0 ? "Advance" : "Settled"}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`font-bold ${total > 0 ? "text-red-600" : total < 0 ? "text-green-600" : "text-gray-700"}`}>
                          {formatCurrency(Math.abs(total))} {total > 0 ? " (due)" : total < 0 ? " (adv)" : ""}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => openPaymentModal(name)} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Receive</button>
                          <button
                            onClick={() =>
                              // quick add "give" transaction of full due (settle)
                              {
                                if (total <= 0) {
                                  alert("Customer has no due to receive.");
                                  return;
                                }
                                const settle = {
                                  id: Date.now(),
                                  customerName: name,
                                  amount: total,
                                  type: "given",
                                  description: "Settled (quick)",
                                  date: new Date().toISOString(),
                                };
                                setTransactions((p) => [...p, settle]);
                              }
                            }
                            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                          >
                            Quick Settle
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right columns: Transactions */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Transaction History</h2>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Debit (Owes)</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Credit (Paid)</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Running Total</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rowsWithRunning.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                          No transactions to show
                        </td>
                      </tr>
                    )}
                    {rowsWithRunning.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(t.date)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{t.customerName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{t.description}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-600 font-semibold">{t.type === "taken" ? formatCurrency(t.amount) : "-"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 font-semibold">{t.type === "given" ? formatCurrency(t.amount) : "-"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">{formatCurrency(t.runningTotal)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button onClick={() => openEdit(t)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button onClick={() => confirmDelete(t.id)} className="text-red-600 hover:text-red-900">Delete</button>
                          <button onClick={() => openPaymentModal(t.customerName)} className="text-green-600 hover:text-green-900">Receive</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {rowsWithRunning.length === 0 && <p className="text-sm text-gray-500">No transactions yet.</p>}
                {rowsWithRunning.map((t) => (
                  <div key={t.id} className="bg-gray-50 p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">{t.customerName}</div>
                        <div className="text-xs text-gray-500">{formatDate(t.date)}</div>
                      </div>
                      <div className="text-right font-mono">{formatCurrency(t.runningTotal)}</div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">{t.description}</div>
                    <div className="mt-3 flex gap-2 items-center">
                      <div className="text-sm">{t.type === "taken" ? <span className="text-red-600 font-semibold">{formatCurrency(t.amount)}</span> : <span className="text-green-600 font-semibold">{formatCurrency(t.amount)}</span>}</div>
                      <div className="ml-auto flex gap-2">
                        <button onClick={() => openEdit(t)} className="text-indigo-600 text-sm">Edit</button>
                        <button onClick={() => confirmDelete(t.id)} className="text-red-600 text-sm">Delete</button>
                        <button onClick={() => openPaymentModal(t.customerName)} className="text-green-600 text-sm">Receive</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Modals */}
        {/* Payment Modal */}
        {isPaymentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-2">Receive Payment from <span className="text-indigo-600">{paymentCustomer}</span></h3>
              <div>
                <label className="block text-sm text-gray-700">Amount (₹)</label>
                <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} autoFocus className="mt-1 w-full px-3 py-2 border rounded" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={closePaymentModal} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
                <button onClick={handleSavePayment} className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && editingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Edit Entry</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700">Customer Name</label>
                  <input name="customerName" value={editingEntry.customerName} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Amount (₹)</label>
                  <input name="amount" value={editingEntry.amount} onChange={handleEditChange} type="number" className="mt-1 w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Type</label>
                  <div className="mt-2 flex gap-4 items-center">
                    <label><input type="radio" name="type" value="taken" checked={editingEntry.type === "taken"} onChange={handleEditChange} /> लिया</label>
                    <label><input type="radio" name="type" value="given" checked={editingEntry.type === "given"} onChange={handleEditChange} /> दिया</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Description</label>
                  <textarea name="description" value={editingEntry.description} onChange={handleEditChange} rows="2" className="mt-1 w-full px-3 py-2 border rounded" />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={closeEdit} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
                  <button onClick={saveEdit} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirm */}
        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
              <h3 className="text-lg font-semibold mb-3">Delete transaction?</h3>
              <p className="text-sm text-gray-600 mb-4">This action cannot be undone. Are you sure you want to delete this transaction?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsDeleteOpen(false)} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
                <button onClick={doDelete} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DairyPage;
