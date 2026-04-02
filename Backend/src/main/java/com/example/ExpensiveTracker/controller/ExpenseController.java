package com.example.ExpensiveTracker.controller;

import com.example.ExpensiveTracker.model.Expense;
import com.example.ExpensiveTracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense){
        return expenseService.saveExpense(expense);
    }
    
    @GetMapping
    public List<Expense> getAllExpenses(){
        return expenseService.getAllExpenses();

    }

    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id){
        expenseService.deleteExpense(id);
        return "Deleted Successfully";
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id,@RequestBody Expense expense){
        return expenseService.updateExpense(id, expense);
    }

    @GetMapping("/category/{category}")
    public List<Expense> getExpensesByCategory (@PathVariable String category){
        return expenseService.getExpensesByCategory(category);
    }

    @GetMapping("/weekly-summary")
    public double getWeeklySummary(){
        return expenseService.getWeeklySummary();
    }
}
