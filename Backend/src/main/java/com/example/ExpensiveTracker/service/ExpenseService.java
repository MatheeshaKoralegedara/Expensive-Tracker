package com.example.ExpensiveTracker.service;

import com.example.ExpensiveTracker.model.Expense;
import com.example.ExpensiveTracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense saveExpense(Expense expense){
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses(){
        return expenseRepository.findAll();
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Long id, Expense newExpense) {
    
    Expense existingExpense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));

  
    existingExpense.setTitle(newExpense.getTitle());
    existingExpense.setAmount(newExpense.getAmount());
    existingExpense.setCategory(newExpense.getCategory());
    existingExpense.setDate(newExpense.getDate());

    
    return expenseRepository.save(existingExpense);
}
    
}
