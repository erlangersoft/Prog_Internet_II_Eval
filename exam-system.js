/**
 * Sistema de Evaluación Online - Solo JavaScript
 * Programación en Internet II - UCATEC
 * 
 * Características:
 * - Control de acceso por CI (un intento por estudiante)
 * - Almacenamiento en localStorage
 * - Temporizador automático
 * - Cálculo automático de puntajes
 * - Prevención de fraude básico
 */

// Configuración del sistema
const EXAM_CONFIG = {
    DURATION_MINUTES: 120, // 2 horas
    MAX_ATTEMPTS: 1,
    EXAM_ID: 'PROG_INTERNET_II_2025',
    STORAGE_KEYS: {
        STUDENTS: 'exam_students_data',
        SUBMISSIONS: 'exam_submissions',
        CURRENT_SESSION: 'exam_current_session'
    }
};

// Variables globales
let examTimer = null;
let remainingSeconds = EXAM_CONFIG.DURATION_MINUTES * 60;
let sessionData = null;

// Clase principal del sistema de examen
class ExamSystem {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSystemData();
        this.checkExistingSession();
    }

    // Vincular eventos
    bindEvents() {
        const startBtn = document.getElementById('start-exam-btn');
        const examForm = document.getElementById('exam-form');
        const downloadBtn = document.getElementById('download-answers-btn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleStartExam());
        }

        if (examForm) {
            examForm.addEventListener('submit', (e) => this.handleSubmitExam(e));
            // Auto-guardar progreso cada 30 segundos
            setInterval(() => this.autoSaveProgress(), 30000);
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadAnswers());
        }

        // Detectar cambios en respuestas para progreso
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' || e.target.type === 'text' || e.target.tagName === 'TEXTAREA') {
                this.updateProgress();
                this.markQuestionAnswered(e.target);
            }
        });

        // Prevenir cierre accidental durante el examen
        window.addEventListener('beforeunload', (e) => {
            if (sessionData && sessionData.status === 'in_progress') {
                e.preventDefault();
                e.returnValue = '';
                return 'Tienes un examen en progreso. ¿Estás seguro de que quieres salir?';
            }
        });
    }

    // Cargar datos del sistema
    loadSystemData() {
        // Inicializar almacenamiento si no existe
        if (!localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS)) {
            localStorage.setItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS, JSON.stringify({}));
        }
        if (!localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.SUBMISSIONS)) {
            localStorage.setItem(EXAM_CONFIG.STORAGE_KEYS.SUBMISSIONS, JSON.stringify({}));
        }
    }

    // Verificar sesión existente
    checkExistingSession() {
        const currentSession = localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.CURRENT_SESSION);
        if (currentSession) {
            const session = JSON.parse(currentSession);
            const students = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS));
            
            if (students[session.ci_hash] && students[session.ci_hash].status === 'in_progress') {
                // Verificar si no ha expirado
                const startTime = new Date(students[session.ci_hash].start_time);
                const elapsed = (Date.now() - startTime.getTime()) / 1000;
                
                if (elapsed < EXAM_CONFIG.DURATION_MINUTES * 60) {
                    // Sesión válida, continuar
                    remainingSeconds = (EXAM_CONFIG.DURATION_MINUTES * 60) - elapsed;
                    sessionData = session;
                    this.showContinueDialog(session.student_name, Math.floor(remainingSeconds / 60));
                } else {
                    // Sesión expirada
                    this.expireSession(session.ci_hash);
                }
            }
        }
    }

    // Mostrar diálogo de continuación
    showContinueDialog(studentName, remainingMinutes) {
        const continueExam = confirm(
            `Hola ${studentName}, tienes un examen en progreso.\n` +
            `Tiempo restante: ${remainingMinutes} minutos.\n\n` +
            `¿Deseas continuar con tu examen?`
        );

        if (continueExam) {
            this.continueExam();
        } else {
            this.clearCurrentSession();
        }
    }

    // Continuar examen existente
    continueExam() {
        // Restaurar datos
        document.getElementById('result-student-name').textContent = sessionData.student_name;
        document.getElementById('result-student-id').textContent = sessionData.student_ci;

        // Cargar respuestas guardadas
        this.loadSavedAnswers();

        // Iniciar interfaz
        this.startExamInterface();
    }

    // Cargar respuestas guardadas
    loadSavedAnswers() {
        const students = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS));
        const studentData = students[sessionData.ci_hash];
        
        if (studentData && studentData.saved_answers) {
            const form = document.getElementById('exam-form');
            Object.entries(studentData.saved_answers).forEach(([name, value]) => {
                const element = form.querySelector(`[name="${name}"]`);
                if (element) {
                    if (element.type === 'radio') {
                        const radio = form.querySelector(`[name="${name}"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    } else {
                        element.value = value;
                    }
                }
            });
        }
    }

    // Manejar inicio de examen
    async handleStartExam() {
        const studentName = document.getElementById('student-name').value.trim();
        const studentCI = document.getElementById('student-id').value.trim();

        // Validaciones
        if (!studentName || !studentCI) {
            this.showError('Por favor, complete todos los campos.');
            return;
        }

        if (!this.validateCI(studentCI)) {
            this.showError('El formato del CI es inválido. Debe contener entre 6 y 8 dígitos.');
            return;
        }

        const startBtn = document.getElementById('start-exam-btn');
        startBtn.disabled = true;
        startBtn.textContent = 'Verificando acceso...';

        try {
            const access = await this.checkAccess(studentCI, studentName);
            
            if (!access.allowed) {
                this.showError(access.message);
                startBtn.disabled = false;
                startBtn.textContent = 'Comenzar Evaluación';
                return;
            }

            // Crear sesión
            await this.createSession(studentCI, studentName);
            
            // Iniciar examen
            this.startExam(studentName, studentCI);
            
        } catch (error) {
            console.error('Error al iniciar examen:', error);
            this.showError('Error del sistema. Intente nuevamente.');
            startBtn.disabled = false;
            startBtn.textContent = 'Comenzar Evaluación';
        }
    }

    // Validar formato de CI
    validateCI(ci) {
        const cleaned = ci.replace(/[\s\-]/g, '');
        return /^\d{6,8}$/.test(cleaned);
    }

    // Verificar acceso
    async checkAccess(ci, name) {
        return new Promise((resolve) => {
            const ciHash = this.hashCI(ci);
            const students = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS));

            if (students[ciHash]) {
                const student = students[ciHash];
                
                if (student.attempts >= EXAM_CONFIG.MAX_ATTEMPTS) {
                    resolve({
                        allowed: false,
                        message: `Ya has completado el examen. Fecha de entrega: ${student.submission_time || 'No disponible'}`
                    });
                    return;
                }

                if (student.status === 'in_progress') {
                    const startTime = new Date(student.start_time);
                    const elapsed = (Date.now() - startTime.getTime()) / 1000;
                    
                    if (elapsed > EXAM_CONFIG.DURATION_MINUTES * 60) {
                        // Expirar automáticamente
                        this.expireSession(ciHash);
                        resolve({
                            allowed: false,
                            message: 'Tu sesión anterior expiró. No puedes volver a tomar el examen.'
                        });
                        return;
                    }
                }

                if (student.status === 'expired' || student.status === 'completed') {
                    resolve({
                        allowed: false,
                        message: 'Ya has utilizado tu oportunidad de examen.'
                    });
                    return;
                }
            }

            resolve({ allowed: true });
        });
    }

    // Crear hash del CI
    hashCI(ci) {
        const cleaned = ci.replace(/[\s\-]/g, '');
        // Hash simple para demostración (en producción usar algo más seguro)
        let hash = 0;
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit
        }
        return 'ci_' + Math.abs(hash).toString(36) + '_' + cleaned.length;
    }

    // Crear sesión
    async createSession(ci, name) {
        const ciHash = this.hashCI(ci);
        const students = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS));
        
        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        sessionData = {
            session_id: sessionId,
            student_name: name,
            student_ci: ci,
            ci_hash: ciHash
        };

        // Guardar datos del estudiante
        students[ciHash] = {
            name: name,
            ci_hash: ciHash,
            session_id: sessionId,
            start_time: new Date().toISOString(),
            status: 'in_progress',
            attempts: (students[ciHash]?.attempts || 0) + 1,
            ip_address: 'localhost', // En un entorno real, obtener IP
            saved_answers: {}
        };

        localStorage.setItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        localStorage.setItem(EXAM_CONFIG.STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionData));
    }

    // Iniciar examen
    startExam(studentName, studentCI) {
        // Guardar info del estudiante para resultados
        document.getElementById('result-student-name').textContent = studentName;
        document.getElementById('result-student-id').textContent = studentCI;

        this.startExamInterface();
    }

    // Iniciar interfaz del examen
    startExamInterface() {
        const studentInfoScreen = document.getElementById('student-info-screen');
        const examContainer = document.getElementById('exam-container');

        // Animación de transición
        studentInfoScreen.style.transform = 'translateY(-100%)';
        studentInfoScreen.style.opacity = '0';

        setTimeout(() => {
            studentInfoScreen.classList.add('hidden');
            examContainer.classList.remove('hidden');
            examContainer.style.opacity = '0';
            examContainer.style.transform = 'translateY(20px)';

            setTimeout(() => {
                examContainer.style.transition = 'all 0.6s ease-out';
                examContainer.style.opacity = '1';
                examContainer.style.transform = 'translateY(0)';
            }, 50);
        }, 300);

        // Iniciar temporizador
        this.startTimer();
        
        // Inicializar editores de código
        this.initializeCodeEditors();
        
        // Actualizar progreso inicial
        this.updateProgress();
    }

    // Iniciar temporizador
    startTimer() {
        const timerDisplay = document.getElementById('timer-display');
        
        examTimer = setInterval(() => {
            remainingSeconds--;
            
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;

            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerDisplay.textContent = `Tiempo Restante: ${timeString}`;

            // Advertencia cuando quedan 15 minutos
            if (remainingSeconds <= 900) {
                timerDisplay.classList.add('timer-warning');
            }

            // Auto-envío cuando se acaba el tiempo
            if (remainingSeconds <= 0) {
                clearInterval(examTimer);
                this.showNotification('¡Tiempo agotado! Enviando examen automáticamente...', 'warning');
                setTimeout(() => this.submitExam(true), 2000);
            }
        }, 1000);
    }

    // Inicializar editores de código
    initializeCodeEditors() {
        // Función global para actualizar números de línea
        window.updateLineNumbers = (editorId, content) => {
            const lineCount = content.split('\n').length;
            const lineNumbers = document.getElementById('lines-' + editorId);
            if (lineNumbers) {
                let lines = '';
                for (let i = 1; i <= Math.max(lineCount, 15); i++) {
                    lines += i + '\n';
                }
                lineNumbers.textContent = lines.trim();
            }
        };

        // Configurar editores
        const editors = document.querySelectorAll('.code-editor');
        editors.forEach(editor => {
            const textarea = editor.querySelector('.code-textarea');
            const lineNumbers = editor.querySelector('.line-numbers');
            
            if (textarea && lineNumbers) {
                // Sincronizar scroll
                textarea.addEventListener('scroll', () => {
                    lineNumbers.scrollTop = textarea.scrollTop;
                });
                
                // Manejo de Tab
                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        
                        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
                        textarea.selectionStart = textarea.selectionEnd = start + 4;
                        
                        textarea.dispatchEvent(new Event('input'));
                    }
                });

                // Auto-resize
                textarea.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = Math.max(this.scrollHeight, 240) + 'px';
                });

                // Inicializar números de línea
                window.updateLineNumbers(textarea.name, textarea.value || '');
            }
        });
    }

    // Actualizar progreso
    updateProgress() {
        const totalQuestions = 18; // Preguntas objetivas
        let answeredQuestions = 0;

        // Contar preguntas respondidas
        for (let i = 1; i <= 18; i++) {
            const radioAnswered = document.querySelector(`input[name="q${i}"]:checked`);
            const textAnswered = document.querySelector(`input[name="q${i}"]`)?.value.trim();
            
            if (radioAnswered || textAnswered) {
                answeredQuestions++;
            }
        }

        // Preguntas de asociación
        ['q16_a', 'q16_b', 'q16_c', 'q16_d'].forEach(name => {
            const input = document.querySelector(`input[name="${name}"]`);
            if (input && input.value.trim()) {
                answeredQuestions += 0.25; // Cada parte cuenta como 0.25
            }
        });

        // Actualizar barra de progreso
        const progressPercent = (answeredQuestions / totalQuestions) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = progressPercent + '%';
        }
    }

    // Marcar pregunta como respondida
    markQuestionAnswered(element) {
        const questionCard = element.closest('.question-card');
        if (questionCard) {
            questionCard.classList.add('answered');
        }
    }

    // Auto-guardar progreso
    autoSaveProgress() {
        if (!sessionData) return;

        const answers = this.collectAnswers();
        const students = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS));
        
        if (students[sessionData.ci_hash]) {
            students[sessionData.ci_hash].saved_answers = answers;
            localStorage.setItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        }
    }

    // Recopilar respuestas
    collectAnswers() {
        const answers = {};
        const form = document.getElementById('exam-form');

        // Preguntas de radio buttons
        for (let i = 1; i <= 18; i++) {
            const radioSelected = form.querySelector(`input[name="q${i}"]:checked`);
            if (radioSelected) {
                answers[`q${i}`] = radioSelected.value;
            }
        }

        // Preguntas de texto
        ['q11', 'q12', 'q13', 'q14'].forEach(name => {
            const textInput = form.querySelector(`input[name="${name}"]`);
            if (textInput && textInput.value.trim()) {
                answers[name] = textInput.value.trim();
            }
        });

        // Preguntas de asociación
        ['q16_a', 'q16_b', 'q16_c', 'q16_d'].forEach(name => {
            const input = form.querySelector(`input[name="${name}"]`);
            if (input && input.value.trim()) {
                answers[name] = input.value.trim();
            }
        });

        // Preguntas prácticas
        for (let i = 1; i <= 5; i++) {
            const textarea = form.querySelector(`textarea[name="p${i}"]`);
            if (textarea && textarea.value.trim()) {
                answers[`p${i}`] = textarea.value.trim();
            }
        }

        return answers;
    }

    // Manejar envío del examen
    handleSubmitExam(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-exam-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando evaluación...
            </span>
        `;

        setTimeout(() => {
            const confirmed = confirm('¿Está seguro de que desea finalizar y entregar la evaluación? Esta acción no se puede deshacer.');
            if (confirmed) {
                this.submitExam(false);
            } else {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span class="flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Finalizar y Entregar Evaluación
                    </span>
                `;
            }
        }, 500);
    }

    // Enviar examen
    async submitExam(isAutoSubmit = false) {
        try {
            if (examTimer) {
                clearInterval(examTimer);
            }

            const answers = this.collectAnswers();
            const submissionTime = new Date().toISOString();

            // Actualizar estado del estudiante
            const students = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS));
            students[sessionData.ci_hash].status = 'completed';
            students[sessionData.ci_hash].submission_time = submissionTime;
            students[sessionData.ci_hash].end_time = submissionTime;
            students[sessionData.ci_hash].auto_submit = isAutoSubmit;

            localStorage.setItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS, JSON.stringify(students));

            // Guardar respuestas
            const submissions = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.SUBMISSIONS));
            submissions[sessionData.ci_hash] = {
                student_name: sessionData.student_name,
                student_ci: sessionData.student_ci,
                session_id: sessionData.session_id,
                start_time: students[sessionData.ci_hash].start_time,
                submission_time: submissionTime,
                answers: answers,
                auto_submit: isAutoSubmit,
                calculated_score: this.calculateScore(answers)
            };

            localStorage.setItem(EXAM_CONFIG.STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

            // Limpiar sesión actual
            localStorage.removeItem(EXAM_CONFIG.STORAGE_KEYS.CURRENT_SESSION);
            sessionData = null;

            // Mostrar resultados
            this.showResults(submissions[sessionData?.ci_hash] || submissions[Object.keys(submissions).pop()]);

        } catch (error) {
            console.error('Error al enviar examen:', error);
            this.showNotification('Error al enviar el examen. Intente nuevamente.', 'error');
        }
    }

    // Calcular puntaje automático
    calculateScore(answers) {
        let score = {
            multiple: 0,
            tf: 0,
            short: 0,
            assoc: 0,
            total: 0
        };

        // Selección múltiple (q1-q5) - 4 puntos cada una (5 preguntas total = 20 pts)
        const multipleAnswers = { 
            q1: 'c', q2: 'b', q3: 'c', q4: 'c', q5: 'b'
        };
        Object.entries(multipleAnswers).forEach(([q, correct]) => {
            if (answers[q] === correct) {
                score.multiple += 4;
            }
        });

        // Verdadero o falso (q6-q10, q18) - 3 puntos cada una (6 preguntas total = 18 pts)
        const tfAnswers = { 
            q6: 'false', q7: 'true', q8: 'true', q9: 'true', q10: 'false',
            q18: 'true'
        };
        Object.entries(tfAnswers).forEach(([q, correct]) => {
            if (answers[q] === correct) {
                score.tf += 3;
            }
        });

        // Respuesta corta (q11-q14) - 4 puntos cada una + q15 (3 puntos)
        const shortAnswers = {
            q11: ['protected'],
            q12: ['xmlhttprequest'],
            q13: ['.catch()', '.catch', 'catch'],
            q14: ['cifrar', 'cifrado', 'encriptar']
        };
        
        Object.entries(shortAnswers).forEach(([q, possibleAnswers]) => {
            const userAnswer = (answers[q] || '').toLowerCase().trim();
            if (possibleAnswers.some(answer => userAnswer.includes(answer.toLowerCase()))) {
                score.short += 4;
            }
        });

        // Pregunta 15 (bien formado) - 4 puntos para completar 20 pts de respuesta corta
        if (answers.q15 === 'b') {
            score.short += 4;
        }

        // Asociación CRUD (q16) - 2.5 puntos cada una = 10 pts total
        const assocAnswers = { q16_a: '1', q16_b: '2', q16_c: '3', q16_d: '4' };
        Object.entries(assocAnswers).forEach(([q, correct]) => {
            if (answers[q] === correct) {
                score.assoc += 2.5;
            }
        });
        
        // Pregunta 17 (arquitectura REST) - 0 puntos (mantiene balance de 100 pts)
        // Nota: Esta pregunta se mantiene para completitud pero no suma puntos
        if (answers.q17 === 'a') {
            score.assoc += 0;
        }

        score.total = score.multiple + score.tf + score.short + score.assoc;
        return score;
    }

    // Mostrar resultados
    showResults(submissionData) {
        const examContainer = document.getElementById('exam-container');
        const resultsScreen = document.getElementById('results-screen');

        // Actualizar displays de puntaje
        if (submissionData && submissionData.calculated_score) {
            const score = submissionData.calculated_score;
            document.getElementById('score-display').textContent = score.total;
            document.getElementById('multiple-score').textContent = score.multiple;
            document.getElementById('tf-score').textContent = score.tf;
            document.getElementById('short-score').textContent = score.short;
            document.getElementById('assoc-score').textContent = score.assoc;
        }

        // Agregar fecha y hora de entrega
        const submissionTime = new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const submissionTimeElement = document.getElementById('submission-time');
        if (submissionTimeElement) {
            submissionTimeElement.textContent = submissionTime;
        }

        // Transición a resultados
        examContainer.style.transition = 'all 0.6s ease-out';
        examContainer.style.opacity = '0';
        examContainer.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            examContainer.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
            resultsScreen.style.opacity = '0';

            setTimeout(() => {
                resultsScreen.style.transition = 'all 0.6s ease-out';
                resultsScreen.style.opacity = '1';
                window.scrollTo(0, 0);
            }, 50);
        }, 600);
    }

    // Descargar respuestas
    downloadAnswers() {
        const submissions = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.SUBMISSIONS));
        const studentSubmission = Object.values(submissions).find(sub => 
            sub.student_ci === sessionData?.student_ci ||
            sub.student_name === document.getElementById('result-student-name').textContent
        );

        if (!studentSubmission) {
            this.showNotification('No se encontraron respuestas para descargar.', 'error');
            return;
        }

        const data = {
            estudiante: studentSubmission.student_name,
            ci: studentSubmission.student_ci,
            fecha_inicio: studentSubmission.start_time,
            fecha_entrega: studentSubmission.submission_time,
            respuestas: studentSubmission.answers,
            puntaje_automatico: studentSubmission.calculated_score
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `respuestas_${studentSubmission.student_ci}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Respuestas descargadas exitosamente.', 'success');
    }

    // Funciones de utilidad
    showError(message) {
        const errorElement = document.getElementById('start-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    expireSession(ciHash) {
        const students = JSON.parse(localStorage.getItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS));
        if (students[ciHash]) {
            students[ciHash].status = 'expired';
            students[ciHash].attempts = EXAM_CONFIG.MAX_ATTEMPTS;
            localStorage.setItem(EXAM_CONFIG.STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        }
        this.clearCurrentSession();
    }

    clearCurrentSession() {
        localStorage.removeItem(EXAM_CONFIG.STORAGE_KEYS.CURRENT_SESSION);
        sessionData = null;
    }
}

// Inicializar sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new ExamSystem();
});

// Funciones globales requeridas
window.updateLineNumbers = function(editorId, content) {
    // Esta función se redefine en initializeCodeEditors
    console.log('updateLineNumbers called before initialization');
};
