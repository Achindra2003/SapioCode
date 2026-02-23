import { Question } from "./types";

export const QUESTIONS: Question[] = [
  // ==================== TOPIC 1: Variables & Basics ====================
  {
    id: "variable-swap",
    title: "Variable Swap",
    topicId: "variables-basics",
    difficulty: "easy",
    description: `Write a function that takes two numbers and returns them swapped.

**Example:**
- Input: a = 5, b = 10
- Output: (10, 5)`,
    starterCode: `def swap_numbers(a, b):
    # Swap the values of a and b
    # Return the swapped values
    pass

# Test
if __name__ == "__main__":
    print(swap_numbers(5, 10))`,
    testCases: [
      { input: "swap_numbers(5, 10)", expectedOutput: "(10, 5)", description: "Basic swap" },
      { input: "swap_numbers(0, 100)", expectedOutput: "(100, 0)", description: "Zero and positive" },
      { input: "swap_numbers(-5, -10)", expectedOutput: "(-10, -5)", description: "Negative numbers" },
    ],
    concepts: ["variables", "assignment", "tuple-unpacking"],
    estimatedTime: 5,
  },
  {
    id: "type-conversion",
    title: "Type Conversion",
    topicId: "variables-basics",
    difficulty: "easy",
    description: `Write a function that takes a string representation of a number and converts it to an integer, then adds 10.

**Example:**
- Input: "42"
- Output: 52`,
    starterCode: `def convert_and_add(num_str):
    # Convert the string to an integer and add 10
    pass

# Test
if __name__ == "__main__":
    print(convert_and_add("42"))`,
    testCases: [
      { input: 'convert_and_add("42")', expectedOutput: "52", description: "Basic conversion" },
      { input: 'convert_and_add("0")', expectedOutput: "10", description: "Zero input" },
      { input: 'convert_and_add("100")', expectedOutput: "110", description: "Larger number" },
    ],
    concepts: ["type-conversion", "int", "string"],
    estimatedTime: 5,
  },
  {
    id: "arithmetic-ops",
    title: "Arithmetic Operations",
    topicId: "variables-basics",
    difficulty: "easy",
    description: `Write a function that takes two numbers and returns a dictionary with their sum, difference, product, and quotient.

**Example:**
- Input: a = 10, b = 2
- Output: {"sum": 12, "diff": 8, "product": 20, "quotient": 5.0}`,
    starterCode: `def arithmetic_operations(a, b):
    # Return a dictionary with sum, diff, product, quotient
    pass

# Test
if __name__ == "__main__":
    print(arithmetic_operations(10, 2))`,
    testCases: [
      { input: "arithmetic_operations(10, 2)", expectedOutput: "{'sum': 12, 'diff': 8, 'product': 20, 'quotient': 5.0}", description: "Basic operations" },
      { input: "arithmetic_operations(20, 4)", expectedOutput: "{'sum': 24, 'diff': 16, 'product': 80, 'quotient': 5.0}", description: "Different values" },
      { input: "arithmetic_operations(15, 3)", expectedOutput: "{'sum': 18, 'diff': 12, 'product': 45, 'quotient': 5.0}", description: "Another set" },
    ],
    concepts: ["arithmetic", "dictionary", "operators"],
    estimatedTime: 8,
  },
  {
    id: "simple-calculator",
    title: "Simple Calculator",
    topicId: "variables-basics",
    difficulty: "easy",
    description: `Write a function that takes two numbers and an operator (+, -, *, /) and returns the result.

**Example:**
- Input: 5, 3, "+"
- Output: 8`,
    starterCode: `def simple_calculator(a, b, operator):
    # Perform the operation based on the operator
    pass

# Test
if __name__ == "__main__":
    print(simple_calculator(5, 3, "+"))`,
    testCases: [
      { input: 'simple_calculator(5, 3, "+")', expectedOutput: "8", description: "Addition" },
      { input: 'simple_calculator(10, 4, "-")', expectedOutput: "6", description: "Subtraction" },
      { input: 'simple_calculator(6, 7, "*")', expectedOutput: "42", description: "Multiplication" },
    ],
    concepts: ["arithmetic", "operators", "basic-logic"],
    estimatedTime: 10,
  },
  {
    id: "temperature-converter",
    title: "Temperature Converter",
    topicId: "variables-basics",
    difficulty: "easy",
    description: `Write a function that converts Celsius to Fahrenheit.
Formula: F = (C * 9/5) + 32

**Example:**
- Input: 0 (Celsius)
- Output: 32.0 (Fahrenheit)`,
    starterCode: `def celsius_to_fahrenheit(celsius):
    # Convert Celsius to Fahrenheit
    pass

# Test
if __name__ == "__main__":
    print(celsius_to_fahrenheit(0))`,
    testCases: [
      { input: "celsius_to_fahrenheit(0)", expectedOutput: "32.0", description: "Freezing point" },
      { input: "celsius_to_fahrenheit(100)", expectedOutput: "212.0", description: "Boiling point" },
      { input: "celsius_to_fahrenheit(25)", expectedOutput: "77.0", description: "Room temperature" },
    ],
    concepts: ["formula", "arithmetic", "float"],
    estimatedTime: 5,
  },
  {
    id: "bmi-calculator",
    title: "BMI Calculator",
    topicId: "variables-basics",
    difficulty: "easy",
    description: `Write a function that calculates BMI given weight (kg) and height (m).
Formula: BMI = weight / (height^2)

**Example:**
- Input: weight = 70, height = 1.75
- Output: 22.86 (rounded to 2 decimals)`,
    starterCode: `def calculate_bmi(weight, height):
    # Calculate BMI and round to 2 decimal places
    pass

# Test
if __name__ == "__main__":
    print(calculate_bmi(70, 1.75))`,
    testCases: [
      { input: "calculate_bmi(70, 1.75)", expectedOutput: "22.86", description: "Normal BMI" },
      { input: "calculate_bmi(50, 1.60)", expectedOutput: "19.53", description: "Lower BMI" },
      { input: "calculate_bmi(90, 1.80)", expectedOutput: "27.78", description: "Higher BMI" },
    ],
    concepts: ["formula", "arithmetic", "rounding"],
    estimatedTime: 8,
  },

  // ==================== TOPIC 2: Conditionals ====================
  {
    id: "even-or-odd",
    title: "Even or Odd",
    topicId: "conditionals",
    difficulty: "easy",
    description: `Write a function that determines if a number is even or odd.

**Example:**
- Input: 4
- Output: "Even"`,
    starterCode: `def even_or_odd(n):
    # Return "Even" or "Odd"
    pass

# Test
if __name__ == "__main__":
    print(even_or_odd(4))`,
    testCases: [
      { input: "even_or_odd(4)", expectedOutput: "Even", description: "Even number" },
      { input: "even_or_odd(7)", expectedOutput: "Odd", description: "Odd number" },
      { input: "even_or_odd(0)", expectedOutput: "Even", description: "Zero is even" },
    ],
    concepts: ["conditionals", "modulo", "if-else"],
    estimatedTime: 5,
  },
  {
    id: "grade-calculator",
    title: "Grade Calculator",
    topicId: "conditionals",
    difficulty: "easy",
    description: `Write a function that takes a score (0-100) and returns the letter grade.
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: 0-59

**Example:**
- Input: 85
- Output: "B"`,
    starterCode: `def get_grade(score):
    # Return the letter grade based on score
    pass

# Test
if __name__ == "__main__":
    print(get_grade(85))`,
    testCases: [
      { input: "get_grade(85)", expectedOutput: "B", description: "B grade" },
      { input: "get_grade(95)", expectedOutput: "A", description: "A grade" },
      { input: "get_grade(55)", expectedOutput: "F", description: "F grade" },
    ],
    concepts: ["conditionals", "if-elif-else", "ranges"],
    estimatedTime: 10,
  },
  {
    id: "leap-year",
    title: "Leap Year Checker",
    topicId: "conditionals",
    difficulty: "medium",
    description: `Write a function to check if a year is a leap year.
A year is a leap year if:
- Divisible by 4 AND
- (Not divisible by 100 OR divisible by 400)

**Example:**
- Input: 2024
- Output: True`,
    starterCode: `def is_leap_year(year):
    # Return True if leap year, False otherwise
    pass

# Test
if __name__ == "__main__":
    print(is_leap_year(2024))`,
    testCases: [
      { input: "is_leap_year(2024)", expectedOutput: "True", description: "Leap year" },
      { input: "is_leap_year(2023)", expectedOutput: "False", description: "Not leap year" },
      { input: "is_leap_year(2000)", expectedOutput: "True", description: "Century leap year" },
    ],
    concepts: ["conditionals", "modulo", "boolean-logic"],
    estimatedTime: 12,
  },
  {
    id: "positive-negative-zero",
    title: "Positive, Negative, or Zero",
    topicId: "conditionals",
    difficulty: "easy",
    description: `Write a function that takes a number and returns "Positive", "Negative", or "Zero".

**Example:**
- Input: 5
- Output: "Positive"`,
    starterCode: `def check_number(n):
    # Return "Positive", "Negative", or "Zero"
    pass

# Test
if __name__ == "__main__":
    print(check_number(5))`,
    testCases: [
      { input: "check_number(5)", expectedOutput: "Positive", description: "Positive number" },
      { input: "check_number(-3)", expectedOutput: "Negative", description: "Negative number" },
      { input: "check_number(0)", expectedOutput: "Zero", description: "Zero" },
    ],
    concepts: ["conditionals", "if-elif-else"],
    estimatedTime: 5,
  },
  {
    id: "max-of-three",
    title: "Maximum of Three Numbers",
    topicId: "conditionals",
    difficulty: "easy",
    description: `Write a function that finds the maximum of three numbers.

**Example:**
- Input: 5, 9, 3
- Output: 9`,
    starterCode: `def max_of_three(a, b, c):
    # Return the maximum of a, b, c
    pass

# Test
if __name__ == "__main__":
    print(max_of_three(5, 9, 3))`,
    testCases: [
      { input: "max_of_three(5, 9, 3)", expectedOutput: "9", description: "Max in middle" },
      { input: "max_of_three(10, 2, 5)", expectedOutput: "10", description: "Max first" },
      { input: "max_of_three(1, 2, 7)", expectedOutput: "7", description: "Max last" },
    ],
    concepts: ["conditionals", "comparison"],
    estimatedTime: 8,
  },
  {
    id: "simple-calculator-conditional",
    title: "Calculator with Error Handling",
    topicId: "conditionals",
    difficulty: "medium",
    description: `Write a calculator function that handles division by zero.
Return "Error" if trying to divide by zero.

**Example:**
- Input: 10, 0, "/"
- Output: "Error"`,
    starterCode: `def safe_calculator(a, b, operator):
    # Handle division by zero
    pass

# Test
if __name__ == "__main__":
    print(safe_calculator(10, 0, "/"))`,
    testCases: [
      { input: 'safe_calculator(10, 0, "/")', expectedOutput: "Error", description: "Division by zero" },
      { input: 'safe_calculator(10, 2, "/")', expectedOutput: "5.0", description: "Normal division" },
      { input: 'safe_calculator(8, 3, "*")', expectedOutput: "24", description: "Multiplication" },
    ],
    concepts: ["conditionals", "error-handling", "operators"],
    estimatedTime: 12,
  },

  // ==================== TOPIC 3: Loops ====================
  {
    id: "sum-of-n",
    title: "Sum of N Numbers",
    topicId: "loops",
    difficulty: "easy",
    description: `Write a function that calculates the sum of numbers from 1 to n.

**Example:**
- Input: 5
- Output: 15 (1+2+3+4+5)`,
    starterCode: `def sum_to_n(n):
    # Calculate sum from 1 to n
    pass

# Test
if __name__ == "__main__":
    print(sum_to_n(5))`,
    testCases: [
      { input: "sum_to_n(5)", expectedOutput: "15", description: "Sum 1-5" },
      { input: "sum_to_n(10)", expectedOutput: "55", description: "Sum 1-10" },
      { input: "sum_to_n(1)", expectedOutput: "1", description: "Single number" },
    ],
    concepts: ["loops", "for-loop", "accumulation"],
    estimatedTime: 8,
  },
  {
    id: "multiplication-table",
    title: "Multiplication Table",
    topicId: "loops",
    difficulty: "easy",
    description: `Write a function that returns the multiplication table for a number as a list.
Return [n*1, n*2, ..., n*10]

**Example:**
- Input: 5
- Output: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]`,
    starterCode: `def multiplication_table(n):
    # Return multiplication table as list
    pass

# Test
if __name__ == "__main__":
    print(multiplication_table(5))`,
    testCases: [
      { input: "multiplication_table(5)", expectedOutput: "[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]", description: "Table of 5" },
      { input: "multiplication_table(2)", expectedOutput: "[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]", description: "Table of 2" },
      { input: "multiplication_table(0)", expectedOutput: "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]", description: "Table of 0" },
    ],
    concepts: ["loops", "list", "for-loop"],
    estimatedTime: 10,
  },
  {
    id: "factorial",
    title: "Factorial",
    topicId: "loops",
    difficulty: "easy",
    description: `Write a function that calculates the factorial of a number.
Factorial of n = n * (n-1) * (n-2) * ... * 1
Factorial of 0 = 1

**Example:**
- Input: 5
- Output: 120`,
    starterCode: `def factorial(n):
    # Calculate factorial of n
    pass

# Test
if __name__ == "__main__":
    print(factorial(5))`,
    testCases: [
      { input: "factorial(5)", expectedOutput: "120", description: "5!" },
      { input: "factorial(0)", expectedOutput: "1", description: "0!" },
      { input: "factorial(7)", expectedOutput: "5040", description: "7!" },
    ],
    concepts: ["loops", "accumulation", "factorial"],
    estimatedTime: 10,
  },
  {
    id: "fibonacci",
    title: "Fibonacci Sequence",
    topicId: "loops",
    difficulty: "medium",
    description: `Write a function that returns the nth Fibonacci number.
Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, ...
F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)

**Example:**
- Input: 7
- Output: 13`,
    starterCode: `def fibonacci(n):
    # Return the nth Fibonacci number
    pass

# Test
if __name__ == "__main__":
    print(fibonacci(7))`,
    testCases: [
      { input: "fibonacci(7)", expectedOutput: "13", description: "7th Fibonacci" },
      { input: "fibonacci(0)", expectedOutput: "0", description: "F(0)" },
      { input: "fibonacci(10)", expectedOutput: "55", description: "10th Fibonacci" },
    ],
    concepts: ["loops", "fibonacci", "sequence"],
    estimatedTime: 15,
  },
  {
    id: "prime-check",
    title: "Prime Number Check",
    topicId: "loops",
    difficulty: "medium",
    description: `Write a function that checks if a number is prime.
A prime number is only divisible by 1 and itself.

**Example:**
- Input: 17
- Output: True`,
    starterCode: `def is_prime(n):
    # Return True if prime, False otherwise
    pass

# Test
if __name__ == "__main__":
    print(is_prime(17))`,
    testCases: [
      { input: "is_prime(17)", expectedOutput: "True", description: "Prime number" },
      { input: "is_prime(4)", expectedOutput: "False", description: "Not prime" },
      { input: "is_prime(2)", expectedOutput: "True", description: "Smallest prime" },
    ],
    concepts: ["loops", "prime", "divisibility"],
    estimatedTime: 15,
  },
  {
    id: "pattern-pyramid",
    title: "Pattern Printing - Pyramid",
    topicId: "loops",
    difficulty: "medium",
    description: `Write a function that prints a pyramid pattern of n rows.
Use asterisks (*) for the pattern.

**Example:** n = 3
Output:
  *
 ***
*****`,
    starterCode: `def print_pyramid(n):
    # Print pyramid pattern
    result = []
    # Build the pyramid rows
    return "\\n".join(result)

# Test
if __name__ == "__main__":
    print(print_pyramid(3))`,
    testCases: [
      { input: "print_pyramid(3)", expectedOutput: "  *\n ***\n*****", description: "3-row pyramid" },
      { input: "print_pyramid(2)", expectedOutput: " *\n***", description: "2-row pyramid" },
      { input: "print_pyramid(1)", expectedOutput: "*", description: "1-row pyramid" },
    ],
    concepts: ["loops", "nested-loops", "pattern"],
    estimatedTime: 20,
  },

  // ==================== TOPIC 4: Arrays & Lists ====================
  {
    id: "two-sum",
    title: "Two Sum",
    topicId: "arrays",
    difficulty: "easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.

You may assume each input has exactly one solution, and you may not use the same element twice.

**Example:**
- Input: nums = [2, 7, 11, 15], target = 9
- Output: [0, 1]`,
    starterCode: `def two_sum(nums, target):
    # Return indices of two numbers that sum to target
    pass

# Test
if __name__ == "__main__":
    print(two_sum([2, 7, 11, 15], 9))`,
    testCases: [
      { input: "two_sum([2, 7, 11, 15], 9)", expectedOutput: "[0, 1]", description: "Basic case" },
      { input: "two_sum([3, 2, 4], 6)", expectedOutput: "[1, 2]", description: "Middle elements" },
      { input: "two_sum([3, 3], 6)", expectedOutput: "[0, 1]", description: "Same values" },
    ],
    concepts: ["arrays", "hash-map", "two-pointers"],
    estimatedTime: 15,
  },
  {
    id: "reverse-array",
    title: "Reverse Array",
    topicId: "arrays",
    difficulty: "easy",
    description: `Write a function that reverses an array in place.

**Example:**
- Input: [1, 2, 3, 4, 5]
- Output: [5, 4, 3, 2, 1]`,
    starterCode: `def reverse_array(arr):
    # Reverse the array
    pass

# Test
if __name__ == "__main__":
    print(reverse_array([1, 2, 3, 4, 5]))`,
    testCases: [
      { input: "reverse_array([1, 2, 3, 4, 5])", expectedOutput: "[5, 4, 3, 2, 1]", description: "Basic reverse" },
      { input: "reverse_array([1])", expectedOutput: "[1]", description: "Single element" },
      { input: "reverse_array([])", expectedOutput: "[]", description: "Empty array" },
    ],
    concepts: ["arrays", "two-pointers", "in-place"],
    estimatedTime: 8,
  },
  {
    id: "find-maximum",
    title: "Find Maximum",
    topicId: "arrays",
    difficulty: "easy",
    description: `Write a function to find the maximum element in an array.

**Example:**
- Input: [3, 7, 2, 9, 1]
- Output: 9`,
    starterCode: `def find_max(arr):
    # Return the maximum element
    pass

# Test
if __name__ == "__main__":
    print(find_max([3, 7, 2, 9, 1]))`,
    testCases: [
      { input: "find_max([3, 7, 2, 9, 1])", expectedOutput: "9", description: "Find max" },
      { input: "find_max([1, 2, 3])", expectedOutput: "3", description: "Max at end" },
      { input: "find_max([-5, -2, -8])", expectedOutput: "-2", description: "Negative numbers" },
    ],
    concepts: ["arrays", "iteration", "comparison"],
    estimatedTime: 8,
  },
  {
    id: "remove-duplicates",
    title: "Remove Duplicates",
    topicId: "arrays",
    difficulty: "medium",
    description: `Write a function that removes duplicates from a sorted array and returns the new length.

**Example:**
- Input: [1, 1, 2, 2, 3]
- Output: 3 (array becomes [1, 2, 3, _, _])`,
    starterCode: `def remove_duplicates(arr):
    # Remove duplicates in place, return new length
    pass

# Test
if __name__ == "__main__":
    print(remove_duplicates([1, 1, 2, 2, 3]))`,
    testCases: [
      { input: "remove_duplicates([1, 1, 2, 2, 3])", expectedOutput: "3", description: "Basic case" },
      { input: "remove_duplicates([1, 1, 1])", expectedOutput: "1", description: "All duplicates" },
      { input: "remove_duplicates([1, 2, 3])", expectedOutput: "3", description: "No duplicates" },
    ],
    concepts: ["arrays", "two-pointers", "in-place"],
    estimatedTime: 15,
  },
  {
    id: "array-rotation",
    title: "Array Rotation",
    topicId: "arrays",
    difficulty: "medium",
    description: `Write a function that rotates an array to the right by k steps.

**Example:**
- Input: [1, 2, 3, 4, 5], k = 2
- Output: [4, 5, 1, 2, 3]`,
    starterCode: `def rotate_array(arr, k):
    # Rotate array right by k steps
    pass

# Test
if __name__ == "__main__":
    print(rotate_array([1, 2, 3, 4, 5], 2))`,
    testCases: [
      { input: "rotate_array([1, 2, 3, 4, 5], 2)", expectedOutput: "[4, 5, 1, 2, 3]", description: "Rotate by 2" },
      { input: "rotate_array([1, 2, 3], 1)", expectedOutput: "[3, 1, 2]", description: "Rotate by 1" },
      { input: "rotate_array([1, 2], 3)", expectedOutput: "[2, 1]", description: "k > length" },
    ],
    concepts: ["arrays", "rotation", "modulo"],
    estimatedTime: 15,
  },
  {
    id: "second-largest",
    title: "Second Largest Element",
    topicId: "arrays",
    difficulty: "medium",
    description: `Write a function to find the second largest element in an array.

**Example:**
- Input: [5, 2, 8, 1, 9]
- Output: 8`,
    starterCode: `def second_largest(arr):
    # Return the second largest element
    pass

# Test
if __name__ == "__main__":
    print(second_largest([5, 2, 8, 1, 9]))`,
    testCases: [
      { input: "second_largest([5, 2, 8, 1, 9])", expectedOutput: "8", description: "Find second largest" },
      { input: "second_largest([1, 2, 3, 4, 5])", expectedOutput: "4", description: "Sorted array" },
      { input: "second_largest([7, 7, 5, 5])", expectedOutput: "5", description: "With duplicates" },
    ],
    concepts: ["arrays", "iteration", "tracking"],
    estimatedTime: 12,
  },

  // ==================== TOPIC 5: Strings ====================
  {
    id: "palindrome-check",
    title: "Palindrome Check",
    topicId: "strings",
    difficulty: "easy",
    description: `Write a function that checks if a string is a palindrome (reads the same forwards and backwards).

**Example:**
- Input: "racecar"
- Output: True`,
    starterCode: `def is_palindrome(s):
    # Return True if palindrome
    pass

# Test
if __name__ == "__main__":
    print(is_palindrome("racecar"))`,
    testCases: [
      { input: 'is_palindrome("racecar")', expectedOutput: "True", description: "Palindrome" },
      { input: 'is_palindrome("hello")', expectedOutput: "False", description: "Not palindrome" },
      { input: 'is_palindrome("a")', expectedOutput: "True", description: "Single char" },
    ],
    concepts: ["strings", "two-pointers", "palindrome"],
    estimatedTime: 10,
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    topicId: "strings",
    difficulty: "easy",
    description: `Write a function that reverses a string.

**Example:**
- Input: "hello"
- Output: "olleh"`,
    starterCode: `def reverse_string(s):
    # Return reversed string
    pass

# Test
if __name__ == "__main__":
    print(reverse_string("hello"))`,
    testCases: [
      { input: 'reverse_string("hello")', expectedOutput: "olleh", description: "Basic reverse" },
      { input: 'reverse_string("a")', expectedOutput: "a", description: "Single char" },
      { input: 'reverse_string("")', expectedOutput: "", description: "Empty string" },
    ],
    concepts: ["strings", "two-pointers", "reversal"],
    estimatedTime: 5,
  },
  {
    id: "count-vowels",
    title: "Count Vowels",
    topicId: "strings",
    difficulty: "easy",
    description: `Write a function that counts the number of vowels in a string.
Vowels: a, e, i, o, u (both lowercase and uppercase)

**Example:**
- Input: "Hello World"
- Output: 3`,
    starterCode: `def count_vowels(s):
    # Return count of vowels
    pass

# Test
if __name__ == "__main__":
    print(count_vowels("Hello World"))`,
    testCases: [
      { input: 'count_vowels("Hello World")', expectedOutput: "3", description: "Basic count" },
      { input: 'count_vowels("AEIOU")', expectedOutput: "5", description: "All uppercase vowels" },
      { input: 'count_vowels("xyz")', expectedOutput: "0", description: "No vowels" },
    ],
    concepts: ["strings", "iteration", "counting"],
    estimatedTime: 8,
  },
  {
    id: "anagram-check",
    title: "Anagram Check",
    topicId: "strings",
    difficulty: "medium",
    description: `Write a function that checks if two strings are anagrams of each other.
Anagrams have the same characters in different order.

**Example:**
- Input: "listen", "silent"
- Output: True`,
    starterCode: `def is_anagram(s1, s2):
    # Return True if anagrams
    pass

# Test
if __name__ == "__main__":
    print(is_anagram("listen", "silent"))`,
    testCases: [
      { input: 'is_anagram("listen", "silent")', expectedOutput: "True", description: "Anagrams" },
      { input: 'is_anagram("hello", "world")', expectedOutput: "False", description: "Not anagrams" },
      { input: 'is_anagram("rat", "tar")', expectedOutput: "True", description: "Simple anagrams" },
    ],
    concepts: ["strings", "sorting", "hash-map"],
    estimatedTime: 12,
  },
  {
    id: "string-compression",
    title: "String Compression",
    topicId: "strings",
    difficulty: "medium",
    description: `Write a function that performs basic string compression.
If compressed string is not smaller, return original.

**Example:**
- Input: "aaabbc"
- Output: "a3b2c1"`,
    starterCode: `def compress_string(s):
    # Return compressed string or original
    pass

# Test
if __name__ == "__main__":
    print(compress_string("aaabbc"))`,
    testCases: [
      { input: 'compress_string("aaabbc")', expectedOutput: "a3b2c1", description: "Basic compression" },
      { input: 'compress_string("abc")', expectedOutput: "abc", description: "No compression benefit" },
      { input: 'compress_string("aaaaaa")', expectedOutput: "a6", description: "Single char repeated" },
    ],
    concepts: ["strings", "iteration", "counting"],
    estimatedTime: 15,
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    topicId: "strings",
    difficulty: "easy",
    description: `Write a function that returns FizzBuzz sequence from 1 to n.
- If divisible by 3: "Fizz"
- If divisible by 5: "Buzz"
- If divisible by both: "FizzBuzz"
- Otherwise: the number as string

**Example:**
- Input: 5
- Output: ["1", "2", "Fizz", "4", "Buzz"]`,
    starterCode: `def fizzbuzz(n):
    # Return FizzBuzz sequence as list
    pass

# Test
if __name__ == "__main__":
    print(fizzbuzz(5))`,
    testCases: [
      { input: "fizzbuzz(5)", expectedOutput: "['1', '2', 'Fizz', '4', 'Buzz']", description: "First 5" },
      { input: "fizzbuzz(15)[-1]", expectedOutput: "FizzBuzz", description: "FizzBuzz at 15" },
      { input: "fizzbuzz(3)", expectedOutput: "['1', '2', 'Fizz']", description: "First 3" },
    ],
    concepts: ["conditionals", "modulo", "iteration"],
    estimatedTime: 10,
  },
];

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return QUESTIONS.filter((q) => q.topicId === topicId);
}
