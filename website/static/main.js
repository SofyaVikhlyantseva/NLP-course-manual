// Отображение/скрытие элементов поиска и элементов мобильного меню
const searchIcon = document.querySelector(".search-icon-container .search-icon");
const searchInput = document.querySelector(".search-input-container input");
const closeIcon = document.querySelector(".search-icon-container .close-icon");
const mobileCloseIcon = document.querySelector(".mobile-menu-container .close-icon");
const mobileMenuContainer = document.querySelector(".mobile-menu-container");
const menuIcon = document.querySelector("nav .menu-icon");

searchIcon.addEventListener("click", () => {
    searchInput.classList.add("active");
    closeIcon.classList.add("active");
    searchIcon.classList.remove("active");
});

closeIcon.addEventListener("click", () => {
    searchInput.classList.remove("active");
    closeIcon.classList.remove("active");
    searchIcon.classList.add("active");
});

menuIcon.addEventListener("click", () => {
    mobileMenuContainer.classList.add("active");
});

mobileCloseIcon.addEventListener("click", () => {
    mobileMenuContainer.classList.remove("active");
});

// Открытие/закрытие модального окна входа
const loginBtns = document.querySelectorAll(".loginBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.querySelector(".modal-content .close-modal");
const loginErrorContainer = document.getElementById("loginErrorContainer");
const registerErrorContainer = document.getElementById("registerErrorContainer");
const registerSuccessContainer = document.getElementById("registerSuccessContainer");

loginBtns.forEach(btn => {
    btn.addEventListener("click", handleLogin);
});

closeModal.addEventListener("click", () => {
    loginModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
});

// Переключение между формами регистрации и входа
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

showRegister.addEventListener("click", (event) => {
    event.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

showLogin.addEventListener("click", (event) => {
    event.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

// Обработка форм входа и регистрации
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(this);

    fetch('/login', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Обновите UI для отображения статуса входа
                // и закройте модальное окно
                updateUIForLoggedInUser();
                closeLoginModal();
            } else {
                // Показать ошибку
                showError(loginErrorContainer, 'Ошибка входа. Пожалуйста, проверьте имя пользователя и пароль.');
            }
        });
});

document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(this);

    fetch('/register', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Показать сообщение об успешной регистрации
                showSuccess(registerSuccessContainer, 'Регистрация прошла успешно. Теперь вы можете войти.');
            } else {
                // Показать ошибку
                showError(registerErrorContainer, 'Ошибка регистрации. Пожалуйста, попробуйте снова.');
            }
        });
});

// Функция для обновления UI после успешного входа
function updateUIForLoggedInUser() {
    loginBtns.forEach(btn => {
        btn.innerText = 'Выйти';
        btn.removeEventListener('click', handleLogin);
        btn.addEventListener('click', handleLogout);
    });
}

// Функция для показа успешных сообщений
function showSuccess(container, successMessage) {
    container.innerText = successMessage;
    container.style.color = 'green';
}

// Функция для показа ошибок
function showError(container, errorMessage) {
    container.innerText = errorMessage;
    container.style.color = 'red';
}

// Функция для обработки выхода
function handleLogin(event) {
    event.preventDefault();  // Предотвращает стандартное поведение ссылки
    loginModal.style.display = "flex";
}

// Функция для обработки выхода
function handleLogout(event) {
    event.preventDefault();  // Предотвращает стандартное поведение ссылки
    document.getElementById('logoutConfirmationModal').style.display = 'flex';

    document.getElementById('confirmLogoutBtn').addEventListener('click', confirmLogout);
    document.getElementById('cancelLogoutBtn').addEventListener('click', cancelLogout);
}

// Функция подтверждения выхода
function confirmLogout() {
    // Выполнение запроса на сервер для завершения сеанса
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        // Проверка успешного завершения сеанса
        if (data.success) {
            // Скрытие модального окна подтверждения выхода
            document.getElementById('logoutConfirmationModal').style.display = 'none';
            // Восстановление кнопки входа
            restoreLoginBtns();
        } else {
            // Обработка ошибки выхода
            showError('logout-error', 'Ошибка выхода. Пожалуйста, попробуйте снова.');
        }
    });
}

// Функция отмены выхода
function cancelLogout() {
    document.getElementById('logoutConfirmationModal').style.display = 'none';
}

// Функция для восстановления текста и обработчика кнопки входа
function restoreLoginBtns() {
    loginBtns.forEach(btn => {
        btn.innerText = 'Войти';
        btn.removeEventListener('click', handleLogout);
        btn.addEventListener('click', handleLogin);
    });
}

// Функция для закрытия модального окна входа
function closeLoginModal() {
    loginModal.style.display = 'none';
}

// Добавляем обработчик для кнопки входа
loginBtns.forEach(btn => {
    btn.addEventListener('click', handleLogin);
});

// Обработка поискового запроса
document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.querySelector('.search-input-container input');

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var query = searchInput.value;
            window.location.href = '/search_results?query=' + encodeURIComponent(query);
        }
    });
});

function submitAnswer(exerciseId) {
    var userAnswer = document.getElementById('user_answer_' + exerciseId).value;
    
    fetch('/check_answer', {
        method: 'POST',
        body: JSON.stringify({
            'exercise_id': exerciseId,
            'user_answer': userAnswer
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        var resultElement = document.getElementById('result-' + exerciseId);
        resultElement.textContent = data.message;
        if (data.message === 'Правильно!') {
            resultElement.style.color = 'green';
        } else {
            resultElement.style.color = 'red';
        }
    })
    .catch(error => console.error('Error:', error));
}

function submitForm(formId) {
    var form = document.getElementById(formId);
    var formData = new FormData(form);
    var exerciseId = formId.split('-').pop();
    var answers = {};

    formData.forEach(function(value, key) {
        answers[key] = value;
    });

    fetch('/check_answers_list', {
        method: 'POST',
        body: JSON.stringify({ exercise_id: exerciseId, user_answers: answers }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result-' + exerciseId).textContent = data.message;
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.matching-test-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var formId = this.id;
            var exerciseId = formId.split('-').pop();  // Извлекаем exercise_id из ID формы
            var answers = [];
            this.querySelectorAll('.right-item').forEach(function(select, index) {
                var answer = select.value;
                var leftId = index + 1; // Предполагаем, что leftId соответствует порядковому номеру вопроса
                answers.push({ leftId: leftId, answer: answer });
            });

            fetch('/check_matching_answers', {
                method: 'POST',
                body: JSON.stringify({ exercise_id: exerciseId, answers: answers }), // Добавляем exercise_id в тело запроса
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('result-' + exerciseId).textContent = data.message;
            })
            .catch(error => console.error('Error:', error));
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchText = urlParams.get('searchText');

    if (searchText) {
        findAndScrollToMatch(decodeURIComponent(searchText));
    }
});

// Универсальная функция для проверки кода
async function runCodeCheck({ textareaId, outputId, expected, template }) {
    const textarea = document.getElementById(textareaId);
    const outputEl = document.getElementById(outputId);

    if (!textarea || !outputEl) {
        console.error("Неверные ID textarea или output:", textareaId, outputId);
        return;
    }

    const studentCode = textarea.value;

    // Шаблон: как оборачиваем код пользователя в проверочный скрипт
    const wrappedCode = template(studentCode);

    try {
        const response = await fetch("/run_code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: wrappedCode })
        });

        const data = await response.json();
        const result = (data.output || "").trim();

        // Если expected — строка, сравниваем строго
        if (typeof expected === "string") {
            if (result === expected) {
                outputEl.textContent = "Всё верно! Результат: " + result;
                outputEl.style.color = "green";
            } else {
                outputEl.textContent =
                    "Неверно.\nВаш ответ: " + result +
                    "\nОжидалось: " + expected;
                outputEl.style.color = "red";
            }
        }
        // Если expected — функция, отдаём ей на проверку
        else if (typeof expected === "function") {
            const checkResult = expected(result);
            if (checkResult === true) {
                outputEl.textContent = "Всё верно! Результат: " + result;
                outputEl.style.color = "green";
            } else {
                outputEl.textContent =
                    "Неверно.\nВаш ответ: " + result +
                    (typeof checkResult === "string" ? "\n" + checkResult : "");
                outputEl.style.color = "red";
            }
        } else {
            // fallback: просто показываем вывод
            outputEl.textContent = result;
            outputEl.style.color = "black";
        }
    } catch (e) {
        outputEl.textContent = "Ошибка при запросе к серверу: " + e;
        outputEl.style.color = "red";
    }
}

// Задание cosine_similarity king–queen для simple_reprs
function runKingQueen() {
    runCodeCheck({
        textareaId: "king-queen-code",
        outputId: "king-queen-output",

        // Проверка: совпадает ли число (с небольшой погрешностью)
        expected: (result) => {
            const expectedValue = 0.997054;
            const parsed = parseFloat(result);

            if (isNaN(parsed)) return "Вывод должен быть числом.";

            if (Math.abs(parsed - expectedValue) < 1e-5) return true;

            return `Ожидалось значение около ${expectedValue}`;
        },

        template: (code) => `
import numpy as np
${code}
`
    });
}
