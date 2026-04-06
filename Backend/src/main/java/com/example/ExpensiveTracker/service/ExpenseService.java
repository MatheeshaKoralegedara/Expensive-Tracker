package com.example.ExpensiveTracker.service;

import com.example.ExpensiveTracker.model.Expense;
import com.example.ExpensiveTracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDate;
import java.util.*;

import com.example.ExpensiveTracker.model.User;
import com.example.ExpensiveTracker.repository.UserRepository;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    public Expense saveExpense(Expense expense, Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses(Long userId){
        return expenseRepository.findByUserId(userId);
    }

    public void deleteExpense(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Long id, Expense newExpense, Long userId) {
    
    Expense existingExpense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));

    if (!existingExpense.getUser().getId().equals(userId)) {
        throw new RuntimeException("Unauthorized");
    }

  
    existingExpense.setTitle(newExpense.getTitle());
    existingExpense.setAmount(newExpense.getAmount());
    existingExpense.setCategory(newExpense.getCategory());
    existingExpense.setDate(newExpense.getDate());

    
    return expenseRepository.save(existingExpense);
}

    public List<Expense> getExpensesByCategory (String category, Long userId){
        return expenseRepository.findByUserIdAndCategory(userId, category);
    }

    public List<Expense> getExpensesByDateRange(LocalDate start, LocalDate end, Long userId){
        return expenseRepository.findByUserIdAndDateBetween(userId, start, end);
    }

    public double getWeeklySummary(Long userId) {

        LocalDate today = LocalDate.now();
        LocalDate lastWeek = today.minusDays(7);

        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(userId, lastWeek, today);

        double total = 0;

        for (Expense e : expenses) {
            total += e.getAmount();
        }
        return total;
    }

    public double getTotalExpenses(Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);

        double total = 0;

        for (Expense e : expenses){
            total += e.getAmount();
        }
        return total;
    }

    public Map<String, Double> getExpensesByCategorySummary(Long userId) {

        List<Expense> expenses = expenseRepository.findByUserId(userId);
        Map<String, Double> summary = new HashMap<>();

        for (Expense e : expenses) {
            String category = e.getCategory();
            double amount = e.getAmount();

            summary.put(category, summary.getOrDefault(category, 0.0) + amount);
        }
        return summary;

    }

    public Map<LocalDate, Double> getWeeklyTrend(Long userId){

        Map<LocalDate, Double> trend = new LinkedHashMap<>();

        LocalDate today = LocalDate.now();

        for(int i = 6; i>=0; i--){
            LocalDate date = today.minusDays(i);

            double total = expenseRepository.findByUserId(userId).stream()
                    .filter(e -> e.getDate().equals(date))
                    .mapToDouble(Expense::getAmount)
                    .sum();
            trend.put(date,total);        

        }

        return trend;
    }




    
}