# Voice to Text Converter - Streamlit App

A professional voice-to-text converter built with Streamlit that provides real-time speech recognition with a clean, modern interface.

## Features

🎤 **Real-time Speech Recognition** - Convert speech to text instantly
📝 **Live Text Editing** - Edit transcribed text directly in the interface  
📊 **Character & Word Count** - Real-time statistics display
📋 **Copy to Clipboard** - One-click text copying
🗑️ **Clear Text** - Quick text clearing functionality
📱 **Responsive Design** - Works on desktop and mobile devices
🎨 **Professional UI** - Clean, modern interface design

## Installation

### Local Development

1. **Clone or download the project**
```bash
git clone <your-repo> # or download the files
cd voice-to-text
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Install system dependencies (for PyAudio)**

**Windows:**
```bash
pip install pipwin
pipwin install pyaudio
```

**macOS:**
```bash
brew install portaudio
pip install pyaudio
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install portaudio19-dev python3-pyaudio
pip install pyaudio
```

4. **Run the application**
```bash
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`

## Deployment to Streamlit Cloud

### Method 1: Direct Upload

1. **Create a GitHub repository** with these files:
   - `app.py`
   - `requirements.txt`
   - `README.md`

2. **Go to [Streamlit Cloud](https://streamlit.io/cloud)**

3. **Deploy your app:**
   - Connect your GitHub account
   - Select your repository
   - Choose `app.py` as the main file
   - Click "Deploy"

### Method 2: Local to Cloud

1. **Push your code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy on Streamlit Cloud** following Method 1

## Configuration

### Environment Variables (Optional)

You can set these in Streamlit Cloud secrets or local environment:

```toml
# .streamlit/secrets.toml
[general]
app_name = "Voice to Text Converter"
```

### App Configuration

The app uses these default settings:
- **Page Title:** "Voice to Text Converter"
- **Layout:** Centered
- **Theme:** Light mode
- **Max Width:** 600px

## Usage

1. **Start Recording:** Click the "🎤 Start" button
2. **Speak Clearly:** Talk into your microphone
3. **Stop Recording:** Click the "⏹️ Stop" button
4. **Edit Text:** Modify the transcribed text if needed
5. **Copy Text:** Use "📋 Copy" to copy to clipboard
6. **Clear Text:** Use "🗑️ Clear" to remove all text

## Troubleshooting

### Common Issues

**Microphone not working:**
- Check browser permissions for microphone access
- Ensure microphone is not muted
- Try refreshing the page

**Poor speech recognition:**
- Speak more slowly and clearly
- Reduce background noise
- Check internet connection (required for Google Speech Recognition)

**Installation issues:**
- For PyAudio issues, install system dependencies first
- Use Python 3.8+ for best compatibility
- Try using virtual environment

### Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## Technical Details

### Dependencies

- **Streamlit:** Web application framework
- **SpeechRecognition:** Python speech recognition library
- **PyAudio:** Audio input/output library
- **Pyperclip:** Clipboard operations

### Architecture

- **Frontend:** Streamlit with custom CSS
- **Speech Recognition:** Google Speech Recognition API
- **Audio Processing:** PyAudio for microphone input
- **Threading:** Background audio processing

## Customization

### Styling

Modify the CSS in `app.py` to change:
- Colors and themes
- Button styles
- Layout and spacing
- Typography

### Features

Extend functionality by adding:
- Multiple language support
- Audio file upload
- Export to different formats
- Voice commands
- Custom wake words

## License

This project is open source. Feel free to use, modify, and distribute.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure all dependencies are installed
4. Check microphone permissions

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Enjoy using the Voice to Text Converter! 🎤✨**