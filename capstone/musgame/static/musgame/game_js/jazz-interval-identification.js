const cycle = [
    'B##', 'E##', 'A##', 'D##', 'G##', 'C##', 'F##', 
    'B#', 'E#', 'A#', 'D#', 'G#', 'C#', 'F#', 
    'B', 'E', 'A', 'D', 'G', 'C', 'F', 
    'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb',
    'Bbb', 'Ebb', 'Abb', 'Dbb', 'Gbb', 'Cbb', 'Fbb'
];

document.addEventListener('DOMContentLoaded', function() {
    const possible_tensions = ['1', '2', '3', '4', '5', '6', '7', '♭2', '♯2', '♭3', '♯4', '♭5', '♯5', '♭6', '♭7'];

    // Pick reasonable root for jazz theory
    let root = random(cycle.slice(13, 26));
    let root_major_scale = major_scale(root);
    let tension = random(possible_tensions);
    let pitch_alteration = '';
    let pitch = calculate_tension(tension, root_major_scale);
                 
    if (pitch.length > 1) {
        pitch_alteration = pitch.slice(1);
        pitch = pitch[0];
    }

    draw(pitch, pitch_alteration);

    document.querySelector('#root-declaration').innerHTML = root;

    document.querySelectorAll('#alteration-button').forEach(alterationButton => {
        alterationButton.onclick = function() {
            document.querySelector('#answer-check').innerHTML = '';
            const answer = document.querySelector('#answer-submit').innerHTML;
            if (answer === '♭' || answer === '♯' || answer === '' || answer === '___') {
                document.querySelector('#answer-submit').innerHTML = alterationButton.value;
            } else if (answer[0] === '♭' || answer[0] === '♯') {
                if (answer.length > 2) {
                    document.querySelector('#answer-submit').innerHTML = alterationButton.value + answer.slice(1, 6) + alterationButton.value + answer.slice(7); 
                } else {
                    document.querySelector('#answer-submit').innerHTML = alterationButton.value + answer.slice(1);
                }
            } else {
                if (answer.length > 1) {
                    document.querySelector('#answer-submit').innerHTML = alterationButton.value + answer.slice(0, 5) + alterationButton.value + answer.slice(5); 
                } else {
                    document.querySelector('#answer-submit').innerHTML = alterationButton.value + answer;
                }
            }
        }
    });


    document.querySelectorAll('#pitch-button').forEach(pitchButton => {
        pitchButton.onclick = function() {
            document.querySelector('#answer-check').innerHTML = '';
            const answer = document.querySelector('#answer-submit').innerHTML;
            if (answer === '♭' || answer === '♯') {
                if (pitchButton.innerHTML.length > 1) {
                    document.querySelector('#answer-submit').innerHTML = answer + pitchButton.innerHTML.slice(0, 5) + answer + pitchButton.innerHTML.slice(5);
                } else {
                    document.querySelector('#answer-submit').innerHTML = answer + pitchButton.innerHTML;
                }
            } else if (answer[0] === '♭' || answer[0] === '♯') {
                if (pitchButton.innerHTML.length > 1) {
                    document.querySelector('#answer-submit').innerHTML = answer[0] + pitchButton.innerHTML.slice(0, 5) + answer[0] + pitchButton.innerHTML.slice(5);
                } else {
                    document.querySelector('#answer-submit').innerHTML = answer[0] + pitchButton.innerHTML;
                }
            } else {
                document.querySelector('#answer-submit').innerHTML = pitchButton.innerHTML;
            }
        }
    });

    document.querySelector('#check-button').onclick = function() {
        const answer = document.querySelector('#answer-submit').innerHTML;

        if (answer === '♭' || answer === '♯' || answer === '' || answer === '___') {
            document.querySelector('#answer-check').style.color = 'olive';
            document.querySelector('#answer-check').innerHTML = 'Please select at least a number';
        } else {
            let tensionSubmit = '';

            if (answer[0] === '♭' || answer[0] === '♯') {
                tensionSubmit = answer[0] + answer[1];
            } else {
                tensionSubmit = answer[0];
            }

            if (tensionSubmit === tension) {
                document.querySelector('#answer-check').style.color = 'green';
                document.querySelector('#answer-check').innerHTML = 'Correct!'
                document.querySelector('#answer-section').style.display = 'none'; ;
                document.querySelector('#check-button').style.display = 'none';
                document.querySelector('#next-button').style.display = 'block';
            } else {
                console.log(tensionSubmit);
                document.querySelector('#answer-check').style.color = 'red';
                document.querySelector('#answer-check').innerHTML = 'Wrong!';
                if (['3', '5', '7'].includes(tension[1]) || ['3', '5', '7'].includes(tension[0])) {
                    document.querySelector('#correction').innerHTML = `The Correct Answer Is "${tension}"`;
                } else if (tension.length === 1) {
                    if (tension === '1') {
                        document.querySelector('#correction').innerHTML = `The Correct Answer Is "1 or Root"`;
                    } else {
                        document.querySelector('#correction').innerHTML = `The Correct Answer Is "${tension} or ${parseInt(tension) + 7}"`;
                    }
                } else {
                    if (tension[1] === '1') {
                        document.querySelector('#correction').innerHTML = `The Correct Answer Is "${tension[0]}1 or ${tension[0]}Root"`;
                    } else {
                        document.querySelector('#correction').innerHTML = `The Correct Answer Is "${tension[0]}${tension[1]} or ${tension[0]}${parseInt(tension[1]) + 7}"`;
                    }
                }
                document.querySelector('#answer-section').style.display = 'none';
                document.querySelector('#check-button').style.display = 'none';  
                document.querySelector('#next-button').style.display = 'block';
            }
        }
    };

    document.querySelector('#next-button').onclick = function() {
        document.querySelector('#output').innerHTML = '';
        document.querySelector('#answer-submit').innerHTML = '___';
        document.querySelector('#answer-check').innerHTML = '';
        document.querySelector('#correction').innerHTML = '';
        document.querySelector('#root-declaration').innerHTML = '';
        document.querySelector('#answer-section').style.display = 'block';
        document.querySelector('#check-button').style.display = 'block';
        document.querySelector('#next-button').style.display = 'none';

        root = random(cycle.slice(13, 26));
        root_major_scale = major_scale(root);
        tension = random(possible_tensions);
        pitch_alteration = '';
        pitch = calculate_tension(tension, root_major_scale);
                 
        if (pitch.length > 1) {
            pitch_alteration = pitch.slice(1);
            pitch = pitch[0];
        }

        draw(pitch, pitch_alteration);
        document.querySelector('#root-declaration').innerHTML = root;
    }
});

function calculate_tension(tension, root_major_scale) {
    let pitch = '';
    let pitchIdx = 0;

    if (tension.length === 1) {
        pitch = root_major_scale[tension[0] - 1];
    } else {
        pitch = root_major_scale[tension[1] - 1];
        if (tension[0] === '♭') {
            pitchIdx = cycle.indexOf(pitch) + 7;
        } else if (tension[0] === '♯') {
            pitchIdx = cycle.indexOf(pitch) - 7;
        }
        pitch = cycle[pitchIdx];
    }
    return pitch
};


function random(type) {
    const num = Math.floor(Math.random() * type.length);
    return type[num]    
};


function major_scale(key) {
    idx = cycle.indexOf(key);
    scale = []
    
    for (let i = 0; i < 3; i++) {
        scale.push(cycle[idx - (i * 2)]);
    }

    for (let i = 0; i < 4; i++) {
        scale.push(cycle[idx + 1 - (i * 2)]);
    }

    return scale
};
    

function draw(pitch, alteration) {
    const { Renderer, Stave, StaveNote, Accidental, Formatter} = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "boo".
    const div = document.getElementById('output');
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(160, 200);
    const context = renderer.getContext();

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Stave(10, 40, 140);

    stave.addClef('treble').addTimeSignature('4/4');

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
    
    // Octave random
    let octave = random([4, 5]);
    
    // Create pitch
    let beat1 = [
        new StaveNote({
            keys: [`${pitch}/${octave}`],
            duration: '1',
        })
    ];

    // Add accidental
    if (alteration) {
        beat1[0].addModifier(new Accidental(alteration))
    }

    Formatter.FormatAndDraw(context, stave, beat1);
};