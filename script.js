fetch('phrases.json')
    .then(response => response.json())
    .then(data => {
        const playButton = document.getElementById('playButton');
        const phraseDisplay = document.getElementById('phraseDisplay');

        let isPlaying = false;

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function playPhrases(phrases) {
            let index = 0;
            shuffleArray(phrases); // Shuffle the array to ensure random order

            function playNextPhrase() {
                if (!isPlaying) {
                    phraseDisplay.textContent = "Playback stopped.";
                    return;
                }

                const phrase = phrases[index];
                const direction = Math.random() > 0.5 ? 'english-to-french' : 'french-to-english';

                if (direction === 'english-to-french') {
                    phraseDisplay.textContent = `English: ${phrase.english} | French: ${phrase.french}`;
                    const englishUtterance = new SpeechSynthesisUtterance(phrase.english);
                    const frenchUtterance = new SpeechSynthesisUtterance(phrase.french);

                    englishUtterance.lang = 'en-US';
                    frenchUtterance.lang = 'fr-FR';

                    englishUtterance.onend = () => speechSynthesis.speak(frenchUtterance);
                    frenchUtterance.onend = () => {
                        index = (index + 1) % phrases.length;
                        playNextPhrase();
                    };

                    speechSynthesis.speak(englishUtterance);
                } else {
                    phraseDisplay.textContent = `French: ${phrase.french} | English: ${phrase.english}`;
                    const frenchUtterance = new SpeechSynthesisUtterance(phrase.french);
                    const englishUtterance = new SpeechSynthesisUtterance(phrase.english);

                    frenchUtterance.lang = 'fr-FR';
                    englishUtterance.lang = 'en-US';

                    frenchUtterance.onend = () => speechSynthesis.speak(englishUtterance);
                    englishUtterance.onend = () => {
                        index = (index + 1) % phrases.length;
                        playNextPhrase();
                    };

                    speechSynthesis.speak(frenchUtterance);
                }
            }

            playNextPhrase();
        }

        playButton.addEventListener('click', () => {
            if (!isPlaying) {
                isPlaying = true;
                playButton.textContent = "Stop";
                playPhrases(data.phrases);
            } else {
                isPlaying = false;
                speechSynthesis.cancel();
                playButton.textContent = "Play";
            }
        });
    })
    .catch(error => console.error('Error loading phrases:', error));
