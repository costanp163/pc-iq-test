# 1. Load and Prepare Data
my_data <- read.csv("iqdataclean.csv", stringsAsFactors = FALSE)
score_cols <- grep("s$", names(my_data), value = TRUE)
my_data[score_cols] <- lapply(my_data[score_cols], as.numeric)
my_data$total_score <- rowSums(my_data[score_cols], na.rm = TRUE)

# 2. FILTER FIRST (Omit scores below 40)
# This ensures your Mean and SD aren't "pulled down" by outliers
my_data <- my_data[my_data$total_score >= 0, ]

# 3. Calculate Stats on the CLEANED data
current_mean <- mean(my_data$total_score, na.rm = TRUE)
current_sd <- sd(my_data$total_score, na.rm = TRUE)

# 4. Standardize to IQ Scale (Mean=100, SD=15)
my_data$IQ_standardized <- ((my_data$total_score - current_mean) / current_sd) * 15 + 100

# 5. Verify results
print(paste("New Min Raw Score:", min(my_data$total_score))) # Should be 40
summary(my_data$IQ_standardized) # The min here will now be much higher than -10
sd(my_data$IQ_standardized) # Should be exactly 15

# 6. Visualize
hist(my_data$IQ_standardized, 
     main="Standardized IQ (Filtered for Raw Score >= 40)", 
     xlab="IQ Score", 
     col="orchid", 
     border="white")

# 1. Re-plot the histogram with 'freq = FALSE' to allow the curve to overlay
hist(my_data$IQ_standardized, 
     prob = TRUE, 
     breaks = 20,
     main = "Standardized IQ vs. Theoretical Bell Curve", 
     xlab = "IQ Score", 
     col = "orchid", 
     border = "white",
     xlim = c(40, 160)) # Sets the horizontal range to see the full curve

# 2. Add the 'Perfect' Theoretical IQ Curve (Mean=100, SD=15)
# Using a sequence of numbers from 40 to 160 for the x-axis
x_values <- seq(40, 160, length = 300)
y_values <- dnorm(x_values, mean = 100, sd = 15)

# 3. Draw the line
lines(x_values, y_values, col = "darkblue", lwd = 3)

# 4. Optional: Add a vertical line for the mean
abline(v = 100, col = "red", lty = 2, lwd = 2)


