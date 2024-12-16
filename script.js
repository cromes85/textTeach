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
            let speedModifiers = [1, 0.5, 1, 0.25]; // Normal, half speed, normal, one-sixth speed
            let speedIndex = 0;

            function playNextPhrase() {
                if (!isPlaying) {
                    phraseDisplay.textContent = "Playback stopped.";
                    return;
                }

                const phrase = phrases[index];
                const direction = Math.random() > 0.5 ? 'english-to-french' : 'french-to-english';
                const speed = speedModifiers[speedIndex % speedModifiers.length];
                speedIndex++;

                if (direction === 'english-to-french') {
                    phraseDisplay.textContent = `English: ${phrase.english} | French: ${phrase.french}`;
                    const englishUtterance = new SpeechSynthesisUtterance(phrase.english);
                    const frenchUtterance = new SpeechSynthesisUtterance(phrase.french);

                    englishUtterance.lang = 'en-US';
                    englishUtterance.rate = speed;

                    frenchUtterance.lang = 'fr-FR';
                    frenchUtterance.rate = speed;

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
                    frenchUtterance.rate = speed;

                    englishUtterance.lang = 'en-US';
                    englishUtterance.rate = speed;

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
