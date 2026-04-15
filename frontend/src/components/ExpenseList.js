
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';

const CATEGORIES = ['Food','Transportation','Bills','Entertainment','Health','Other'];

function getBadgeClass(cat) {
  const map = { Food:'badge-food', Transportation:'badge-transportation', Bills:'badge-bills', Entertainment:'badge-entertainment', Health:'badge-health', Other:'badge-other' };
  return map[cat] || 'badge-other';
}

function ExpenseList({ onEdit }) {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchExpenses = useCallback(() => {
    setLoading(true);
    api.get('/expenses').then(res => setExpenses(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const deleteExpense = (id) => {
    setDeleteId(id);
    api.delete(`/expenses/${id}`).then(() => fetchExpenses()).catch(console.error).finally(() => setDeleteId(null));
  };

  const filterByCategory = () => {
    if (!category) return fetchExpenses();
    setLoading(true);
    api.get(`/expenses/category/${category}`).then(res => setExpenses(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  const filterByDateRange = () => {
    if (!startDate || !endDate) return alert('Please select both dates.');
    setLoading(true);
    api.get(`/expenses/filter?start=${startDate}&end=${endDate}`).then(res => setExpenses(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setCategory(''); setStartDate(''); setEndDate(''); setSearch('');
    fetchExpenses();
  };

  const filtered = search ? expenses.filter(e => e.title.toLowerCase().includes(search.toLowerCase())) : expenses;

  const inputStyle = { display:'block', fontSize:11, fontWeight:600, color:'var(--text-muted)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' };

  return (
    <div className="fade-in">
      {/* Filters panel */}
      <div className="glass" style={{ padding:24, marginBottom:20 }}>
        <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700 }}>Filters</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
          <div>
            <label style={inputStyle}>Search</label>
            <input className="input-field" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div>
            <label style={inputStyle}>Category</label>
            <select className="input-field" value={category} onChange={e => setCategory(e.target.value)} style={{ appearance:'none', cursor:'pointer' }}>
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={inputStyle}>From</label>
            <input className="input-field" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label style={inputStyle}>To</label>
            <input className="input-field" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={filterByCategory} style={{ flex:1, padding:'10px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:10, fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='#5a52d5'} onMouseLeave={e => e.currentTarget.style.background='var(--accent)'}>
            Filter by Category
          </button>
          <button onClick={filterByDateRange} style={{ flex:1, padding:'10px', background:'var(--surface-2)', color:'var(--text)', border:'1px solid var(--border)', borderRadius:10, fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background='var(--surface-2)'}>
            Filter by Date
          </button>
          <button onClick={resetFilters} style={{ padding:'10px 18px', background:'none', color:'var(--text-muted)', border:'1px solid var(--border)', borderRadius:10, fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:13, cursor:'pointer' }}>
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>Expenses</h3>
          <span style={{ fontSize:13, color:'var(--text-muted)', background:'var(--surface-2)', padding:'4px 12px', borderRadius:20, border:'1px solid var(--border)' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div style={{ padding:32 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:48, marginBottom:8 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'64px 32px' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🗂️</div>
            <p style={{ color:'var(--text-muted)', margin:0 }}>No expenses found</p>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Title','Amount','Category','Date','Actions'].map(h => (
                    <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((exp, i) => (
                  <tr key={exp.id} className="expense-row" style={{ borderBottom:'1px solid var(--border)', animationDelay:`${i*30}ms` }}>
                    <td style={{ padding:'16px 20px', fontWeight:500 }}>{exp.title}</td>
                    <td style={{ padding:'16px 20px' }}><span className="amount">Rs. {Number(exp.amount).toLocaleString('en-IN', {minimumFractionDigits:2})}</span></td>
                    <td style={{ padding:'16px 20px' }}><span className={`badge ${getBadgeClass(exp.category)}`}>{exp.category}</span></td>
                    <td style={{ padding:'16px 20px', color:'var(--text-muted)', fontSize:13 }}>{exp.date}</td>
                    <td style={{ padding:'16px 20px' }}>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => onEdit(exp)} style={{ padding:'6px 14px', background:'rgba(108,99,255,0.12)', color:'var(--accent)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(108,99,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(108,99,255,0.12)'}>
                          Edit
                        </button>
                        <button onClick={() => deleteExpense(exp.id)} disabled={deleteId === exp.id} style={{ padding:'6px 14px', background:'rgba(255,107,107,0.1)', color:'var(--red)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.15s', opacity:deleteId===exp.id?0.5:1 }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(255,107,107,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,107,107,0.1)'}>
                          {deleteId === exp.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseList;