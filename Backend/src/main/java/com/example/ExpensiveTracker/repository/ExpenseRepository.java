package com.example.ExpensiveTracker.repository;

import com.example.ExpensiveTracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
}
