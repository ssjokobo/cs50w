const cycle = [
    'B##', 'E##', 'A##', 'D##', 'G##', 'C##', 'F##', 
    'B#', 'E#', 'A#', 'D#', 'G#', 'C#', 'F#', 
    'B', 'E', 'A', 'D', 'G', 'C', 'F', 
    'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb',
    'Bbb', 'Ebb', 'Abb', 'Dbb', 'Gbb', 'Cbb', 'Fbb'
];

document.addEventListener('DOMContentLoaded', function() {
    const possible_interval = ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'];

    let root = random(cycle.slice(13, 26));
    let root_major_scale = major_scale(root);
    let interval = random(possible_interval);
    let pitch = root_major_scale[interval[1] - 1];
    let alteration = get_alteration(pitch, interval);
    pitch = pitch_modify(pitch, alteration, interval);

    draw(root[0], root.slice(1), pitch[0], pitch.slice(1)); 

    document.querySelectorAll('#alteration-button').forEach(alterationButton => {
        alterationButton.onclick = function() {
            document.querySelector('#answer-check').innerHTML = '';
            const answer = document.querySelector('#answer-submit').innerHTML;
            if (['d', 'm', 'M', 'P', 'A'].includes(answer[0])) {
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


    document.querySelectorAll('#interval-button').forEach(intervalButton => {
        intervalButton.onclick = function() {
            document.querySelector('#answer-check').innerHTML = '';
            const answer = document.querySelector('#answer-submit').innerHTML;
            if (['d', 'm', 'M', 'P', 'A'].includes(answer)) {
                if (intervalButton.innerHTML.length > 1) {
                    document.querySelector('#answer-submit').innerHTML = answer + intervalButton.innerHTML.slice(0, 5) + answer + intervalButton.innerHTML.slice(5);
                } else {
                    document.querySelector('#answer-submit').innerHTML = answer + intervalButton.innerHTML;
                }
            } else if (['d', 'm', 'M', 'P', 'A'].includes(answer[0])) {
                if (intervalButton.innerHTML.length > 1) {
                    document.querySelector('#answer-submit').innerHTML = answer[0] + intervalButton.innerHTML.slice(0, 5) + answer[0] + intervalButton.innerHTML.slice(5);
                } else {
                    document.querySelector('#answer-submit').innerHTML = answer[0] + intervalButton.innerHTML;
                }
            } else {
                document.querySelector('#answer-submit').innerHTML = intervalButton.innerHTML;
            }
        }
    });

    document.querySelector('#check-button').onclick = function() {
        const answer = document.querySelector('#answer-submit').innerHTML;

        if (answer === '') {
            document.querySelector('#answer-check').style.color = 'olive';
            document.querySelector('#answer-check').innerHTML = 'Please select at least a type and an intervalic number';
        } else if (['d', 'm', 'M', 'P', 'A'].includes(answer)) {
            document.querySelector('#answer-check').style.color = 'olive';
            document.querySelector('#answer-check').innerHTML = 'Please also select at least an intervalic number';
        } else if (Array.from(Array(7).keys()).includes(parseInt(answer[0]) - 1)) {
            document.querySelector('#answer-check').style.color = 'olive';
            document.querySelector('#answer-check').innerHTML = 'Please also select at least a type ';
        } else {
            
            if (alteration !== '') {
                interval = alteration + interval.slice(1);
            }
            
            if (answer.slice(0, 2) === interval) {
                document.querySelector('#answer-check').style.color = 'green';
                document.querySelector('#answer-check').innerHTML = 'Correct!'
                document.querySelector('#answer-section').style.display = 'none'; ;
                document.querySelector('#check-button').style.display = 'none';
                document.querySelector('#next-button').style.display = 'block';
            } else {
                document.querySelector('#answer-check').style.color = 'red';
                document.querySelector('#answer-check').innerHTML = 'Wrong!';
                if (interval[1] === '1') {
                    document.querySelector('#correction').innerHTML = `The Correct Answer Is "${interval[0]}1 or ${interval[0]}8"`;
                } else {
                    document.querySelector('#correction').innerHTML = `The Correct Answer Is "${interval}"`;
                }
                if ((['m', 'M'].includes(answer[0]) && ['1', '4', '5'].includes(answer[1])) || (answer[0] === 'P' && ['2', '3', '6', '7'].includes(answer[1]))) {
                    document.querySelector('#intervalic-error').innerHTML = `There is no "${answer}" in western music theory`;
                }
            }

            document.querySelector('#answer-section').style.display = 'none';
            document.querySelector('#check-button').style.display = 'none';  
            document.querySelector('#next-button').style.display = 'block';
        }
    };

    document.querySelector('#next-button').onclick = function() {
        document.querySelector('#output').innerHTML = '';
        document.querySelector('#answer-submit').innerHTML = '';
        document.querySelector('#answer-check').innerHTML = '';
        document.querySelector('#correction').innerHTML = '';
        document.querySelector('#intervalic-error').innerHTML = '';
        document.querySelector('#answer-section').style.display = 'block';
        document.querySelector('#check-button').style.display = 'block';
        document.querySelector('#next-button').style.display = 'none';

        root = random(cycle.slice(13, 26));
        root_major_scale = major_scale(root);
        interval = random(possible_interval);
        pitch = root_major_scale[interval[1] - 1];
        pitch_alteration = interval[0];
        alteration = get_alteration(pitch, interval);
        pitch = pitch_modify(pitch, alteration, interval);

        draw(root[0], root.slice(1), pitch[0], pitch.slice(1)); 
    }
});

function get_alteration(pitch, interval) {
    const possible_alteration = ['m', 'd', 'A', ''];
    let alteration;

    do {
            if (interval[0] === 'P') {
                alteration = random(possible_alteration.slice(1));
            } else {
                alteration = random(possible_alteration);
            }
        } while (cycle.indexOf(pitch) + 14 > cycle.length && alteration === 'd');

    return alteration
};

function pitch_modify(pitch, alteration, interval){
    if (alteration !== '' && interval[0] === 'P') {
            if (alteration === 'd') {
                pitch = cycle[cycle.indexOf(pitch) + 7]; 
            } else if (alteration === 'A') {
                pitch = cycle[cycle.indexOf(pitch) - 7];
            }
        } else if (alteration !== '' && interval[0] === 'M') {
            if (alteration === 'm') {
                pitch = cycle[cycle.indexOf(pitch) + 7]; 
            } else if (alteration === 'A') {
                pitch = cycle[cycle.indexOf(pitch) - 7];
            } else if (alteration === 'd') {
                pitch = cycle[cycle.indexOf(pitch) + 14]; 
            }
        }
    return pitch
}


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
    

function draw(root, root_alt, pitch, alteration) {
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
    let pitch_octave;

    // Check range
    const aAeolian = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    if (aAeolian.indexOf(root[0]) < aAeolian.indexOf(pitch[0])) {
        pitch_octave = octave;
    } else {
        pitch_octave = octave + 1;
    }

    // Create pitch
    let beat1 = [
        new StaveNote({
            keys: [`${root}/${octave}`, `${pitch}/${pitch_octave}`],
            duration: '1',
        })
    ];

    // Add accidental
    if (root_alt) {
        beat1[0].addModifier(new Accidental(root_alt), 0);
    }
    
    if (alteration) {
        beat1[0].addModifier(new Accidental(alteration), 1);
    }

    Formatter.FormatAndDraw(context, stave, beat1);
};