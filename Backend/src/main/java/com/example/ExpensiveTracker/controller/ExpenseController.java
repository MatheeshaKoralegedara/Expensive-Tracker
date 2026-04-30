package com.example.ExpensiveTracker.controller;

import com.example.ExpensiveTracker.model.Expense;
import com.example.ExpensiveTracker.service.ExpenseService;
import com.example.ExpensiveTracker.util.AuthTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense, @RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.saveExpense(expense, AuthTokenUtil.getUserIdFromHeader(authHeader));
    }
    
    @GetMapping
    public List<Expense> getAllExpenses(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getAllExpenses(AuthTokenUtil.getUserIdFromHeader(authHeader));

    }

    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader){
        expenseService.deleteExpense(id, AuthTokenUtil.getUserIdFromHeader(authHeader));
        return "Deleted Successfully";
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id,@RequestBody Expense expense, @RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.updateExpense(id, expense, AuthTokenUtil.getUserIdFromHeader(authHeader));
    }

    @GetMapping("/category/{category}")
    public List<Expense> getExpensesByCategory (@PathVariable String category, @RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getExpensesByCategory(category, AuthTokenUtil.getUserIdFromHeader(authHeader));
    }

    @GetMapping("/weekly-summary")
    public double getWeeklySummary(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getWeeklySummary(AuthTokenUtil.getUserIdFromHeader(authHeader));
    }

    @GetMapping("/total")
    public double getTotalExpenses(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getTotalExpenses(AuthTokenUtil.getUserIdFromHeader(authHeader));
    }

    @GetMapping("/category-summary")
    public Map<String, Double> getCategorySummary(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getExpensesByCategorySummary(AuthTokenUtil.getUserIdFromHeader(authHeader));
    }

    @GetMapping("/weekly-trend")
    public Map<LocalDate, Double> getWeeklyTrend(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getWeeklyTrend(AuthTokenUtil.getUserIdFromHeader(authHeader));
    }

    @GetMapping("/filter")
    public List<Expense> filterByDate(
            @RequestParam String start,
            @RequestParam String end,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
                
        return expenseService.getExpensesByDateRange(startDate, endDate, AuthTokenUtil.getUserIdFromHeader(authHeader));
                
            }
    



}
