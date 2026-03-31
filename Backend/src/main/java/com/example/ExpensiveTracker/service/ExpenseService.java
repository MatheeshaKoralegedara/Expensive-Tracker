package com.example.ExpensiveTracker.service;

import com.example.ExpensiveTracker.model.Expense;
import com.example.ExpensiveTracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense saveExpense(Expense expense){
        return expenseRepository.save(expense);
    }
    
}
