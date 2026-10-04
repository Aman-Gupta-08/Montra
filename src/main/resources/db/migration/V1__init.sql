-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Income Table
CREATE TABLE income (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    source VARCHAR(255) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    income_date DATE NOT NULL,
    description VARCHAR(500),
    payment_method VARCHAR(255),
    attachment_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_income_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Expenses Table
CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    expense_date DATE NOT NULL,
    description VARCHAR(500),
    payment_method VARCHAR(255),
    attachment_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Recurring Expenses Table
CREATE TABLE recurring_expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    frequency VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    next_due_date DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recurring_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Loans Table
CREATE TABLE loans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    person_name VARCHAR(255) NOT NULL,
    person_phone VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    original_amount NUMERIC(19, 4) NOT NULL,
    remaining_amount NUMERIC(19, 4) NOT NULL,
    start_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Loan Payments Table
CREATE TABLE loan_payments (
    id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(255),
    description VARCHAR(500),
    attachment_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_payments_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
);

-- Loan Due Date History Table
CREATE TABLE loan_due_date_history (
    id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL,
    old_due_date DATE NOT NULL,
    new_due_date DATE NOT NULL,
    extension_days INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_due_date_history_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Attachments Table
CREATE TABLE attachments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(255),
    file_size BIGINT,
    uploaded_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Businesses Table
CREATE TABLE businesses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(255),
    location VARCHAR(255),
    description VARCHAR(1000),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_businesses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Business Transactions Table
CREATE TABLE business_transactions (
    id BIGSERIAL PRIMARY KEY,
    business_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    transaction_date DATE NOT NULL,
    description VARCHAR(500),
    payment_method VARCHAR(255),
    attachment_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_business_transactions_business FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Staff Table
CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    business_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    phone VARCHAR(255),
    joining_date DATE,
    salary NUMERIC(19, 4) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_staff_business FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Salary Payments Table
CREATE TABLE salary_payments (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    salary_month VARCHAR(50) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    payment_date DATE,
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(255),
    comment VARCHAR(500),
    attachment_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_salary_payments_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- Database Indexes for performance optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_income_user_date ON income(user_id, income_date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX idx_recurring_expenses_user ON recurring_expenses(user_id);
CREATE INDEX idx_loans_user_status ON loans(user_id, status);
CREATE INDEX idx_businesses_user ON businesses(user_id);
CREATE INDEX idx_business_transactions_business_date ON business_transactions(business_id, transaction_date);
CREATE INDEX idx_staff_business ON staff(business_id);
CREATE INDEX idx_salary_payments_staff_month ON salary_payments(staff_id, salary_month);
