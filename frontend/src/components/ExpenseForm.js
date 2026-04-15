import React, { useEffect, useState } from 'react';
import api from '../api';

const CATEGORIES = ['Food','Transportation','Bills','Entertainment','Health','Other'];

function getBadgeClass(cat) {
  const map = { Food:'badge-food', Transportation:'badge-transportation', Bills:'badge-bills', Entertainment:'badge-entertainment', Health:'badge-health', Other:'badge-other' };
  return map[cat] || 'badge-other';
}

function ExpenseForm({ onAdd, selectedExpense, onCancel }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedExpense) {
      setTitle(selectedExpense.title);
      setAmount(selectedExpense.amount);
      setCategory(selectedExpense.category);
      setDate(selectedExpense.date.split('T')[0]);
    } else {
      setTitle(''); setAmount(''); setCategory(''); setDate(new Date().toISOString().split('T')[0]);
    }
  }, [selectedExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const expenseData = { title, amount: parseFloat(amount), category, date };
    const req = selectedExpense ? api.put(`/expenses/${selectedExpense.id}`, expenseData) : api.post('/expenses', expenseData);
    req.then(() => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      if (!selectedExpense) { setTitle(''); setAmount(''); setCategory(''); setDate(new Date().toISOString().split('T')[0]); }
      onAdd();
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  };

  const inputStyle = { display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div className="glass" style={{ padding:'32px 28px', maxWidth:520 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>
          {selectedExpense ? '✏️ Edit Expense' : '+ New Expense'}
        </h2>
        {selectedExpense && onCancel && (
          <button onClick={onCancel} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:22, lineHeight:1 }}>×</button>
        )}
      </div>

      {success && (
        <div style={{ background:'rgba(67,233,123,0.1)', border:'1px solid rgba(67,233,123,0.25)', borderRadius:10, padding:'10px 14px', fontSize:13, color:'var(--green)', marginBottom:20 }}>
          ✓ {selectedExpense ? 'Expense updated!' : 'Expense added!'}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <div>
          <label style={inputStyle}>Title</label>
          <input className="input-field" placeholder="e.g. Groceries at Keells" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label style={inputStyle}>Amount (Rs.)</label>
          <input className="input-field" placeholder="0.00" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div>
          <label style={inputStyle}>Category</label>
          <select className="input-field" value={category} onChange={e => setCategory(e.target.value)} required style={{ appearance:'none', cursor:'pointer' }}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {category && (
            <div style={{ marginTop:8 }}>
              <span className={`badge ${getBadgeClass(category)}`}>{category}</span>
            </div>
          )}
        </div>
        <div>
          <label style={inputStyle}>Date</label>
          <input className="input-field" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop:4, opacity:loading?0.7:1 }}>
          {loading ? 'Saving...' : selectedExpense ? 'Update Expense' : 'Add Expense →'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;