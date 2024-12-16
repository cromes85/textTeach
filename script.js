fetch('phrases.json')
    .then(response => response.json())
    .then(data => {
        const playButton = document.getElementById('playButton');
        const phraseDisplay = document.getElementById('phraseDisplay');

        let index = 0;

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

            speechSynthesis.speak(englishUtterance);

            index++;
        }

        playButton.addEventListener('click', playPhrase);
    })
    .catch(error => console.error('Error loading phrases:', error));
