package com.example.ExpensiveTracker.controller;

import com.example.ExpensiveTracker.model.Expense;
import com.example.ExpensiveTracker.service.ExpenseService;
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

   private Long getUserIdForRequest(String authHeader) {
    if (authHeader == null) {
        return 1L; // fallback user
    }

    if (authHeader.startsWith("Bearer dummy-token-")) {
        return Long.parseLong(authHeader.replace("Bearer dummy-token-", ""));
    }

    throw new RuntimeException("Unauthorized");
}

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense, @RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.saveExpense(expense, getUserIdForRequest(authHeader));
    }
    
    @GetMapping
    public List<Expense> getAllExpenses(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getAllExpenses(getUserIdForRequest(authHeader));

    }

    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader){
        expenseService.deleteExpense(id, getUserIdForRequest(authHeader));
        return "Deleted Successfully";
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id,@RequestBody Expense expense, @RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.updateExpense(id, expense, getUserIdForRequest(authHeader));
    }

    @GetMapping("/category/{category}")
    public List<Expense> getExpensesByCategory (@PathVariable String category, @RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getExpensesByCategory(category, getUserIdForRequest(authHeader));
    }

    @GetMapping("/weekly-summary")
    public double getWeeklySummary(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getWeeklySummary(getUserIdForRequest(authHeader));
    }

    @GetMapping("/total")
    public double getTotalExpenses(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getTotalExpenses(getUserIdForRequest(authHeader));
    }

    @GetMapping("/category-summary")
    public Map<String, Double> getCategorySummary(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getExpensesByCategorySummary(getUserIdForRequest(authHeader));
    }

    @GetMapping("/weekly-trend")
    public Map<LocalDate, Double> getWeeklyTrend(@RequestHeader(value = "Authorization", required = false) String authHeader){
        return expenseService.getWeeklyTrend(getUserIdForRequest(authHeader));
    }

    @GetMapping("/filter")
    public List<Expense> filterByDate(
            @RequestParam String start,
            @RequestParam String end,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
                
        return expenseService.getExpensesByDateRange(startDate, endDate, getUserIdForRequest(authHeader));
                
            }
    



}