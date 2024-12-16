fetch('phrases.json')
    .then(response => response.json())
    .then(data => {
        const playButton = document.getElementById('playButton');
        const phraseDisplay = document.getElementById('phraseDisplay');

        let index = 0;
        let isPlaying = false;

        function playPhrase() {
            if (index >= data.phrases.length) {
                index = 0; // Reset to the first phrase after finishing
            }

            const phrase = data.phrases[index];
            phraseDisplay.textContent = `English: ${phrase.english} | French: ${phrase.french}`;

            // Speak the English phrase
            const englishUtterance = new SpeechSynthesisUtterance(phrase.english);
            englishUtterance.lang = 'en-US';

            // Speak the French phrase
            const frenchUtterance = new SpeechSynthesisUtterance(phrase.french);
            frenchUtterance.lang = 'fr-FR';

            englishUtterance.onend = () => {
                speechSynthesis.speak(frenchUtterance);
            };

            frenchUtterance.onend = () => {
                if (isPlaying) {
                    index++;
                    playPhrase();
                }
            };

            speechSynthesis.speak(englishUtterance);
        }

        playButton.addEventListener('click', () => {
            if (!isPlaying) {
                isPlaying = true;
                playPhrase();
                playButton.textContent = "Stop";
            } else {
                isPlaying = false;
                speechSynthesis.cancel();
                playButton.textContent = "Play";
                phraseDisplay.textContent = "Playback stopped.";
            }
        });
    })
    .catch(error => console.error('Error loading phrases:', error));
