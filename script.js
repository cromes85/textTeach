fetch('phrases_and_words.json')
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

        function playContent(content) {
            let index = 0;
            shuffleArray(content); // Shuffle the array for random order
            let speedModifiers = [1, 0.75, 1, 0.5]; // Normal and slower speeds
            let speedIndex = 0;

            function playNext() {
                if (!isPlaying) {
                    phraseDisplay.textContent = "Playback stopped.";
                    return;
                }

                const item = content[index];
                const speed = speedModifiers[speedIndex % speedModifiers.length];
                speedIndex++;

                const direction = Math.random() > 0.5 ? 'english-to-french' : 'french-to-english';

                if (direction === 'english-to-french') {
                    phraseDisplay.textContent = `English: ${item.english} | French: ${item.french}`;
                    const englishUtterance = new SpeechSynthesisUtterance(item.english);
                    const frenchUtterance = new SpeechSynthesisUtterance(item.french);

                    englishUtterance.lang = 'en-US';
                    englishUtterance.rate = speed;

                    frenchUtterance.lang = 'fr-FR';
                    frenchUtterance.rate = speed;

                    englishUtterance.onend = () => speechSynthesis.speak(frenchUtterance);
                    frenchUtterance.onend = () => {
                        index = (index + 1) % content.length;
                        playNext();
                    };

                    speechSynthesis.speak(englishUtterance);
                } else {
                    phraseDisplay.textContent = `French: ${item.french} | English: ${item.english}`;
                    const frenchUtterance = new SpeechSynthesisUtterance(item.french);
                    const englishUtterance = new SpeechSynthesisUtterance(item.english);

                    frenchUtterance.lang = 'fr-FR';
                    frenchUtterance.rate = speed;

                    englishUtterance.lang = 'en-US';
                    englishUtterance.rate = speed;

                    frenchUtterance.onend = () => speechSynthesis.speak(englishUtterance);
                    englishUtterance.onend = () => {
                        index = (index + 1) % content.length;
                        playNext();
                    };

                    speechSynthesis.speak(frenchUtterance);
                }
            }

            playNext();
        }

        playButton.addEventListener('click', () => {
            if (!isPlaying) {
                isPlaying = true;
                playButton.textContent = "Stop";
                playContent(data.content);
            } else {
                isPlaying = false;
                speechSynthesis.cancel();
                playButton.textContent = "Play";
            }
        });
    })
    .catch(error => console.error('Error loading content:', error));
