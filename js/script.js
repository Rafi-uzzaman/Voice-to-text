/**
 * Voice to Text Converter Application
 * Handles speech recognition, UI interactions, and text operations
 */

class VoiceToTextConverter {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.isSupported = false;
        
        // DOM Elements
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            stopBtn: document.getElementById('stop-btn'),
            clearBtn: document.getElementById('clear-btn'),
            copyBtn: document.getElementById('copy-btn'),
            textarea: document.getElementById('convert_text'),
            charCounter: document.getElementById('char-counter'),
            statusText: document.getElementById('status-text'),
            statusDot: document.querySelector('.status-dot')
        };
        
        this.init();
    }
    
    init() {
        this.checkBrowserSupport();
        this.setupEventListeners();
        this.updateCharCount();
        this.updateStatus('Ready to record', 'ready');
        
        if (this.isSupported) {
            this.setupSpeechRecognition();
        }
    }
    
    checkBrowserSupport() {
        // Check for Web Speech API support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.isSupported = true;
            this.recognition = new SpeechRecognition();
        } else {
            this.isSupported = false;
            this.showError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
            this.elements.startBtn.disabled = true;
        }
    }
    
    setupSpeechRecognition() {
        if (!this.recognition) return;
        
        // Configure speech recognition
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;
        
        // Event handlers
        this.recognition.onstart = () => {
            this.onRecognitionStart();
        };
        
        this.recognition.onresult = (event) => {
            this.onRecognitionResult(event);
        };
        
        this.recognition.onerror = (event) => {
            this.onRecognitionError(event);
        };
        
        this.recognition.onend = () => {
            this.onRecognitionEnd();
        };
    }
    
    setupEventListeners() {
        // Button event listeners
        this.elements.startBtn.addEventListener('click', () => this.startRecording());
        this.elements.stopBtn.addEventListener('click', () => this.stopRecording());
        this.elements.clearBtn.addEventListener('click', () => this.clearText());
        this.elements.copyBtn.addEventListener('click', () => this.copyText());
        
        // Textarea event listeners
        this.elements.textarea.addEventListener('input', () => this.updateCharCount());
        this.elements.textarea.addEventListener('paste', () => {
            // Update char count after paste
            setTimeout(() => this.updateCharCount(), 0);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'Enter':
                        event.preventDefault();
                        if (!this.isRecording) {
                            this.startRecording();
                        } else {
                            this.stopRecording();
                        }
                        break;
                    case 'Escape':
                        event.preventDefault();
                        if (this.isRecording) {
                            this.stopRecording();
                        }
                        break;
                    case 'Backspace':
                        if (event.shiftKey) {
                            event.preventDefault();
                            this.clearText();
                        }
                        break;
                }
            }
        });
    }
    
    startRecording() {
        if (!this.isSupported || this.isRecording) return;
        
        try {
            this.recognition.start();
        } catch (error) {
            this.showError('Failed to start recording. Please try again.');
        }
    }
    
    stopRecording() {
        if (!this.isRecording) return;
        
        try {
            this.recognition.stop();
        } catch (error) {
            this.onRecognitionEnd();
        }
    }
    
    onRecognitionStart() {
        this.isRecording = true;
        this.elements.startBtn.disabled = true;
        this.elements.stopBtn.disabled = false;
        this.updateStatus('Recording... Speak now', 'recording');
        
        // Visual feedback
        this.elements.startBtn.innerHTML = `
            <i class="fas fa-microphone"></i>
            <span>Recording...</span>
        `;
    }
    
    onRecognitionResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        // Process recognition results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update textarea with final transcript
        if (finalTranscript) {
            const currentText = this.elements.textarea.value;
            const newText = currentText + finalTranscript;
            this.elements.textarea.value = newText;
            this.updateCharCount();
            
            // Auto-scroll to bottom
            this.elements.textarea.scrollTop = this.elements.textarea.scrollHeight;
        }
        
        // Show interim results in status
        if (interimTranscript) {
            this.updateStatus(`Recognizing: "${interimTranscript}"`, 'recording');
        }
    }
    
    onRecognitionError(event) {
        let errorMessage = 'An error occurred during speech recognition.';
        
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'No microphone found. Please check your microphone.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'language-not-supported':
                errorMessage = 'Language not supported.';
                break;
            case 'service-not-allowed':
                errorMessage = 'Speech recognition service not allowed.';
                break;
        }
        
        this.showError(errorMessage);
        this.onRecognitionEnd();
    }
    
    onRecognitionEnd() {
        this.isRecording = false;
        this.elements.startBtn.disabled = false;
        this.elements.stopBtn.disabled = true;
        this.updateStatus('Ready to record', 'ready');
        
        // Reset button text
        this.elements.startBtn.innerHTML = `
            <i class="fas fa-microphone"></i>
            <span>Start Recording</span>
        `;
    }
    
    clearText() {
        if (this.elements.textarea.value.length === 0) return;
        
        if (confirm('Are you sure you want to clear all text?')) {
            this.elements.textarea.value = '';
            this.updateCharCount();
            this.elements.textarea.focus();
            this.showSuccess('Text cleared successfully');
        }
    }
    
    async copyText() {
        const text = this.elements.textarea.value.trim();
        
        if (text.length === 0) {
            this.showError('No text to copy');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess('Text copied to clipboard');
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyText(text);
        }
    }
    
    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showSuccess('Text copied to clipboard');
        } catch (error) {
            this.showError('Failed to copy text');
        }
        
        document.body.removeChild(textArea);
    }
    
    updateCharCount() {
        const text = this.elements.textarea.value;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        this.elements.charCounter.textContent = `${charCount} characters, ${wordCount} words`;
    }
    
    updateStatus(message, type = 'ready') {
        this.elements.statusText.textContent = message;
        
        // Update status dot
        this.elements.statusDot.className = `status-dot ${type}`;
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
    
    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#6366f1';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VoiceToTextConverter();
});

// Add helpful keyboard shortcuts info
document.addEventListener('DOMContentLoaded', () => {
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        opacity: 0.7;
        z-index: 100;
    `;
    shortcutsInfo.innerHTML = `
        <strong>Shortcuts:</strong> Ctrl+Enter (Start/Stop) • Ctrl+Esc (Stop) • Ctrl+Shift+Backspace (Clear)
    `;
    
    document.body.appendChild(shortcutsInfo);
    
    // Hide shortcuts info after 10 seconds
    setTimeout(() => {
        shortcutsInfo.style.transition = 'opacity 0.5s';
        shortcutsInfo.style.opacity = '0';
        setTimeout(() => {
            if (shortcutsInfo.parentNode) {
                shortcutsInfo.parentNode.removeChild(shortcutsInfo);
            }
        }, 500);
    }, 10000);
});