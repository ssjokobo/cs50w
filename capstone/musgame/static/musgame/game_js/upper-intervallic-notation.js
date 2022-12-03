const cycle = [
    'B##', 'E##', 'A##', 'D##', 'G##', 'C##', 'F##', 
    'B#', 'E#', 'A#', 'D#', 'G#', 'C#', 'F#', 
    'B', 'E', 'A', 'D', 'G', 'C', 'F', 
    'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb',
    'Bbb', 'Ebb', 'Abb', 'Dbb', 'Gbb', 'Cbb', 'Fbb'
];

document.addEventListener('DOMContentLoaded', function() {
    const possible_interval = ['M2', 'M3', 'P4', 'P5', 'M6', 'M7', 'P8'];

    let root = random(cycle.slice(13, 26));
    let root_major_scale = major_scale(root);
    let root_octave = random([3, 4, 5]);
    let interval = random(possible_interval);
    let correctPitch = root_major_scale[(parseInt(interval[1]) - 1) % 7];
    let alteration = get_alteration(correctPitch, interval);
    correctPitch = pitch_modify(correctPitch, alteration, interval);

    // Correct answer octave
    if (major_scale('C').indexOf(root[0]) + parseInt(interval[1]) - 1 > 6) {
        correctPitch = correctPitch + `/${root_octave + 1}`;
    } else {
        correctPitch = correctPitch + `/${root_octave}`;
    }
    
    draw(root, root_octave);

    // Asking question
    if (alteration) {
        document.querySelector('#question').innerHTML = alteration + interval[1];
    } else {
        document.querySelector('#question').innerHTML = interval;
    }

    // Check
    document.querySelector('#check-button').addEventListener('click', () => {
        const answer = document.querySelector('.root').getAttribute('value');

        if (!answer) {
            document.querySelector('#answer-check').style.color = 'olive';
            document.querySelector('#answer-check').innerHTML = 'Please notate a pitch';
        } else if (answer === correctPitch) {
            document.querySelector('#answer-check').style.color = 'green';
            document.querySelector('#answer-check').innerHTML = 'Correct!';
            document.querySelector('#check-button').style.display = 'none';
            document.querySelector('#next-button').style.display = 'block';
        } else {
            document.querySelector('#answer-check').style.color = 'red';
            const alteration_list = ['bb', 'b', '', '#', '##'];
            const alteration_list_unicode = ['𝄫', '♭', '', '♯', '𝄪'];
            let correctPitch_formatted = correctPitch[0] + alteration_list_unicode[alteration_list.indexOf(correctPitch.slice(1, correctPitch.length - 2))];
            document.querySelector('#answer-check').innerHTML = `Wrong! The correct answer is that specific ${correctPitch_formatted}.`;
            
            let to_be_added = [`${root}/${root_octave}`];
            let redIdx;
            const answerRange = major_scale('C').indexOf(answer[0]) + answer[answer.length - 1] * 7;
            const correctRange = major_scale('C').indexOf(correctPitch[0]) + correctPitch[correctPitch.length - 1] * 7;

                if (answerRange > correctRange) {
                    to_be_added.push(correctPitch);
                    to_be_added.push(answer);
                    redIdx = 1;
                } else {
                    to_be_added.push(answer);
                    to_be_added.push(correctPitch);
                    redIdx = 2;
                }
            
            drawCorrect(to_be_added);
            document.querySelector('#check-button').style.display = 'none';  
            document.querySelector('#next-button').style.display = 'block';
            const all_heads = document.querySelector('.vf-stavenote').querySelectorAll('.vf-notehead');
            all_heads[redIdx].querySelector('path').setAttribute('fill', 'red');

            if (correctPitch.length > 3) {

                let redAcciIdx = 0;
                if (root.length > 1) {
                    redAcciIdx++;
                }
                if (redIdx === 2) {
                    if (answer.length > 3) {
                        redAcciIdx++;
                    }
                }
                const all_accidentals = document.querySelector('.vf-modifiers').querySelectorAll('path');
                all_accidentals[redAcciIdx].setAttribute('fill', 'red');
            }
        }

        // Next
        document.querySelector('#next-button').addEventListener('click', () => {
            document.querySelector('svg').remove();
            document.querySelector('#check-button').style.display = 'block';  
            document.querySelector('#next-button').style.display = 'none';
            document.querySelector('#answer-check').innerHTML = '';
            root = random(cycle.slice(13, 26));
            root_major_scale = major_scale(root);
            root_octave = random([3, 4, 5]);
            interval = random(possible_interval);
            correctPitch = root_major_scale[(parseInt(interval[1]) - 1) % 7];
            alteration = get_alteration(correctPitch, interval);
            correctPitch = pitch_modify(correctPitch, alteration, interval);

            // Correct answer octave
            if (major_scale('C').indexOf(root[0]) + parseInt(interval[1]) - 1 > 6) {
                correctPitch = correctPitch + `/${root_octave + 1}`;
            } else {
                correctPitch = correctPitch + `/${root_octave}`;
            }
            
            draw(root, root_octave);

            // Asking question
            if (alteration) {
                document.querySelector('#question').innerHTML = alteration + interval[1];
            } else {
                document.querySelector('#question').innerHTML = interval;
            }
        });

    });
});
    

function draw(root, root_octave) {

    const { Renderer, Stave, StaveNote, Accidental, Formatter} = Vex.Flow;
    const cMajor = major_scale('C');

    // Create an SVG renderer and attach it to the DIV element named "boo".
    const div = document.getElementById('output');
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(160, 200);
    const context = renderer.getContext();

    // Create a stave on the canvas.
    const stave = new Stave(10, 40, 140);
    
    // Create environment
    invisibleLines('upper-between', 25);
    invisibleLines('upper-on', 30);
    invisibleLines('middle-between', 75);
    invisibleLines('middle-on', 80);
    invisibleLines('lower-between', 125);
    invisibleLines('lower-on', 130);
    stave.addClef('treble').addTimeSignature('4/4');
    visibleLines();

    // Add root
    addNote([`${root}/${root_octave}`]);
    document.querySelector('.vf-stavenote').setAttribute('class', 'root');


    // Accidental buttons
    document.querySelectorAll('#accidental-button').forEach(button => {
        
        button.onclick = function() {

            let pitch = document.querySelector('.root').getAttribute('value');

            if (pitch) {
                document.querySelector('.root').remove();
                pitch = pitch[0] + button.value + '/' + pitch[pitch.length - 1];
                addNote([`${root}/${root_octave}`, pitch]);
                document.querySelector('.vf-stavenote').setAttribute('value', pitch);
                document.querySelector('.vf-stavenote').setAttribute('class', 'root');
            }

        };
        
    });


    // Draw invisible lines
    function invisibleLines(name, location) {
        stave.setContext(context).draw();

        const container = document.querySelector('.vf-stave');

        container.setAttribute('class', `${name}`);
        container.querySelector('rect').remove();
        container.querySelector('rect').remove();

        let i = 0;
        container.querySelectorAll('path').forEach(line => {
            const position = location + i * 10;
            const pitch = cMajor[6 - (position/5 + 1) % 7];
            const octave = 7 - Math.floor((position/5 + 1) / 7);
            line.setAttribute('stroke', '#FFFFFF');
            line.setAttribute('stroke-width', '5');
            line.setAttribute('d', `M10 ${position}L150 ${position}`);
            line.setAttribute('value', `${pitch}/${octave}`);
            if (root_octave < octave) {
                addMouseFunction(line);
            } else if (root_octave === octave && cMajor.indexOf(root[0]) <= cMajor.indexOf(pitch)) {
                addMouseFunction(line);
            }
            i++;
        });
    };


    function visibleLines() {
    
        stave.setContext(context).draw();
        const container = document.querySelector('.vf-stave');
        container.setAttribute('class', 'visible-lines');

        let i = 0;
        container.querySelectorAll(':scope > path').forEach(line => {
            const position = 80 + i * 10;
            const pitch = cMajor[6 - (position/5 + 1) % 7];
            const octave = 7 - Math.floor((position/5 + 1) / 7);
            line.setAttribute('d', `M10 ${position}L150 ${position}`);
            line.setAttribute('value', `${pitch}/${octave}`);
            if (root_octave < octave) {
                addMouseFunction(line);
            } else if (root_octave === octave && cMajor.indexOf(root[0]) <= cMajor.indexOf(pitch)) {
                addMouseFunction(line);
            }
            i++;
        });
    };


    function addNote(pitchList) {
        
        let keysList = []

        for (let i = 0; i < pitchList.length; i++) {
            const pitch = pitchList[i];
            keysList.push(`${pitch[0]}/${pitch[pitch.length - 1]}`);
        }

        let beat1 = [
            new StaveNote({
                keys: keysList,
                duration: '1',
            })
        ];

        for (let i = 0; i < pitchList.length; i++) {
            const pitch = pitchList[i];
            if (pitch.length > 3) {
                beat1[0].addModifier(new Accidental(pitch.slice(1, -2)), i);
            }
        }

        Formatter.FormatAndDraw(context, stave, beat1);
    };


    function addMouseFunction(line) {
        const lineValue = line.getAttribute('value');

        line.addEventListener('mouseover', () => {
            document.querySelector('.root').style.display = 'none';
            const prevValue = document.querySelector('.root').getAttribute('value');
            let to_be_added = [`${root}/${root_octave}`];
            let preSelectIdx;

            if (prevValue) {

                const prevRange = cMajor.indexOf(prevValue[0]) + prevValue[prevValue.length - 1] * 7;
                const lineRange = cMajor.indexOf(lineValue[0]) + lineValue[lineValue.length - 1] * 7;

                if (prevRange > lineRange) {
                    to_be_added.push(lineValue);
                    to_be_added.push(prevValue);
                    preSelectIdx = 1;
                } else {
                    to_be_added.push(prevValue);
                    to_be_added.push(lineValue);
                    preSelectIdx = 2;
                }
                

            } else {
                to_be_added.push(lineValue);
                preSelectIdx = 1;
            }

            addNote(to_be_added); 

            document.querySelector('.vf-stavenote').setAttribute('class', 'pre-select');
            const all_heads = document.querySelector('.pre-select').querySelectorAll('.vf-notehead');
            all_heads[preSelectIdx].querySelector('path').setAttribute('fill', 'gray');
            
        });


        line.addEventListener('mouseleave', () => {
            document.querySelector('.root').style.display = 'block';

            const existingPitch = document.querySelector('.pre-select');
            if (existingPitch) {
                existingPitch.remove();
            }
        });


        line.addEventListener('click', () => {
            document.querySelector('.root').remove();
            addNote([`${root}/${root_octave}`, lineValue]);
            document.querySelector('.vf-stavenote').setAttribute('value', lineValue);
            document.querySelector('.vf-stavenote').setAttribute('class', 'root');
            const preSelect = document.querySelector('.pre-select');
            if (preSelect) {
                preSelect.remove();
            }
        });
        
    };
};


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


function pitch_modify(pitch, alteration, interval) {
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


function drawCorrect(pitchList) {
    document.querySelector('svg').remove();

    const { Renderer, Stave, StaveNote, Accidental, Formatter} = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "boo".
    const div = document.getElementById('output');
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(160, 200);
    const context = renderer.getContext();

    // Create a stave on the canvas.
    const stave = new Stave(10, 40, 140);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    let keysList = []

    for (let i = 0; i < pitchList.length; i++) {
        const pitch = pitchList[i];
        keysList.push(`${pitch[0]}/${pitch[pitch.length - 1]}`);
    }

    let beat1 = [
        new StaveNote({
            keys: keysList,
            duration: '1',
        })
    ];

    for (let i = 0; i < pitchList.length; i++) {
        const pitch = pitchList[i];
        if (pitch.length > 3) {
            beat1[0].addModifier(new Accidental(pitch.slice(1, -2)), i);
        }
    }

    Formatter.FormatAndDraw(context, stave, beat1);
};