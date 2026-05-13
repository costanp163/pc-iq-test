# 1. LOAD CLEAN DATA
# Since the CSV is now properly formatted, read.csv works perfectly
viqt_data <- read.csv("VIQT_data.csv", stringsAsFactors = FALSE)

# 2. FILTER FOR VALIDITY
# Isolate valid data by removing scores of 0 or less 
# (removes non-serious attempts or pure guessing)
viqt_clean <- viqt_data[viqt_data$score_full > -10, ]

# 3. CALCULATE RAW BENCHMARKS
v_mean <- mean(viqt_clean$score_full, na.rm = TRUE)
v_sd   <- sd(viqt_clean$score_full, na.rm = TRUE)

# 4. STANDARDIZE TO IQ SCALE
# Transforming raw crystallized intelligence scores to Mean=100, SD=15
viqt_clean$IQ_standardized <- ((viqt_clean$score_full - v_mean) / v_sd) * 15 + 100

# 5. VERIFY IN CONSOLE
print("--- Standardized IQ Summary ---")
print(summary(viqt_clean$IQ_standardized))
print(paste("Standard Deviation:", round(sd(viqt_clean$IQ_standardized, na.rm = TRUE), 2)))

# 6. HIGH-PRECISION HISTOGRAM
# Using 45 breaks to match the 45 items on the test battery
hist(viqt_clean$IQ_standardized, 
     prob = TRUE, 
     breaks = 20, 
     main = "Standardized Vocabulary IQ vs. Theoretical Distribution", 
     xlab = "IQ Score (Mean = 100, SD = 15)", 
     col = "steelblue", 
     border = "white",
     xlim = c(40, 160))

# 7. OVERLAY THEORETICAL BELL CURVE
# Generates the mathematically perfect normal distribution for comparison
x_vals <- seq(40, 160, length = 300)
y_vals <- dnorm(x_vals, mean = 100, sd = 15)
lines(x_vals, y_vals, col = "darkred", lwd = 3)

# 8. MARK THE MEAN
abline(v = 100, col = "black", lty = 2, lwd = 2)

# Install and load the psych library
if(!require(psych)) install.packages("psych")
library(psych)

# 1. Select only the vocabulary question columns for the analysis
# We use the 'viqt_clean' data you already filtered
q_data <- viqt_clean[, paste0("Q", 1:45)]

# Parallel analysis suggests how many factors to extract
fa.parallel(q_data, fm = "minres", fa = "fa")

# Run Exploratory Factor Analysis (EFA)
# fm="minres" is a standard extraction method
# rotate="oblimin" allows factors to correlate (common in IQ testing)
fa_result <- fa(q_data, nfactors = 1, rotate = "oblimin", fm = "minres")

# View the loadings
# High loadings (e.g., > 0.4) mean that question is a strong measure of the factor
print(fa_result$loadings, cutoff = 0.3)