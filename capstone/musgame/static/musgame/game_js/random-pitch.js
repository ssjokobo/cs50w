document.addEventListener('DOMContentLoaded', function() {
    const allPitches = ['C', 'D&#9837', 'D', 'E&#9837', 'E', 'F', 'G&#9837/F&#9839', 'G', 'A&#9837', 'A', 'B&#9837', 'B'];
    let onButtons = [];
    
    document.querySelectorAll('#pitch-button').forEach(button => {
        button.onclick = function() {
            if (button.getAttribute('class') === 'on') {
                for (i = 0; i < onButtons.length; i++) {
                    if (onButtons[i] === button.value) {
                        onButtons.splice(i, 1);
                        break;
                    }
                }
                button.setAttribute('class', 'off');
            } else {
                onButtons.push(button.value);
                button.setAttribute('class', 'on');
            }
        };
    });

    document.querySelectorAll('#pre-config-button').forEach(button => {
        button.onclick = function() {
            onButtons = button.value.split(',');
            document.querySelectorAll('#pitch-button').forEach(pitchButton => {
                if (onButtons.includes(pitchButton.value)) {
                    pitchButton.setAttribute('class', 'on');
                } else {
                    pitchButton.setAttribute('class', 'off');
                }
            });
        };
    });

    document.querySelector('#random-button').onclick = function() {
        const result = document.querySelector('#result');
        if (onButtons.length < 2) {
            result.innerHTML = 'Please pick at least two pitches'
            result.style.color = 'red';
            result.style.fontSize = '28px';
        } else {
            result.innerHTML = `${allPitches[random(onButtons)]}`;
            result.style.fontSize = '72px';

            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    result.innerHTML = `${allPitches[random(onButtons)]}`;
                }, 20 * i);
            }
            result.style.color = 'blue';    

        }
    };
});

function random(type) {
    const num = Math.floor(Math.random() * type.length);
    return type[num]    
};