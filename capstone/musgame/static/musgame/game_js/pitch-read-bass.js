document.addEventListener('DOMContentLoaded', function() {

    const pitch_list = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const alteration_list = ['bb', 'b', '', '#', '##'];

    let pitch = random(pitch_list);
    let alteration = random(alteration_list);
    let bass_clef_pitch = treble_to_bass(pitch);

    draw(bass_clef_pitch, alteration);

    document.querySelectorAll('#pitch-button').forEach(pitchButton => {
        pitchButton.onclick = function() {
            document.querySelector('#answer-check').innerHTML = '';
            document.querySelector('#answer-submit').innerHTML = pitchButton.value;
        }
    })


    document.querySelectorAll('#accidental-button').forEach(accidentalButton => {
        accidentalButton.onclick = function() {
            const pitch = document.querySelector('#answer-submit').innerHTML
            if (pitch) {
                document.querySelector('#answer-check').innerHTML = '';
                document.querySelector('#answer-submit').innerHTML = pitch[0] + accidentalButton.value;
            }
        }
    })


    document.querySelector('#check-button').onclick = function() {
        const answer = document.querySelector('#answer-submit').innerHTML;

        if (answer.length === 0) {
            document.querySelector('#answer-check').style.color = 'olive';
            document.querySelector('#answer-check').innerHTML = 'Please select a pitch';
        } else {
            const alteration_list_unicode = ['𝄫', '♭', '', '♯', '𝄪'];
            const answer_alteration_idx = alteration_list_unicode.indexOf(answer.slice(1));
            const check_alteration_idx = alteration_list.indexOf(alteration);

            if (answer[0] === pitch && answer_alteration_idx === check_alteration_idx) {
                document.querySelector('#answer-check').style.color = 'green';
                document.querySelector('#answer-check').innerHTML = 'Correct!';
                document.querySelector('#answer-section').style.display = 'none';
                document.querySelector('#check-button').style.display = 'none';
                document.querySelector('#next-button').style.display = 'block';
            } else {
                document.querySelector('#answer-check').style.color = 'red';
                document.querySelector('#answer-check').innerHTML = 'Wrong!';  
                document.querySelector('#correction').innerHTML = `The Correct Answer Is ${pitch}${alteration}`;
                document.querySelector('#answer-section').style.display = 'none';
                document.querySelector('#check-button').style.display = 'none';  
                document.querySelector('#next-button').style.display = 'block';
            }
        }
    }

    document.querySelector('#next-button').onclick = function() {
        document.querySelector('#output').innerHTML = '';
        document.querySelector('#answer-submit').innerHTML = '';
        document.querySelector('#answer-check').innerHTML = '';
        document.querySelector('#correction').innerHTML = '';
        document.querySelector('#answer-section').style.display = 'block';
        document.querySelector('#check-button').style.display = 'block';
        document.querySelector('#next-button').style.display = 'none';
        pitch = random(pitch_list);
        alteration = random(alteration_list);
        bass_clef_pitch = treble_to_bass(pitch);
        draw(bass_clef_pitch, alteration);
    }
        
});


function random(type) {
    const num = Math.floor(Math.random() * type.length);
    return type[num]    
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

    stave.addClef('bass').addTimeSignature('4/4');

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
}

function treble_to_bass(pitch) {
    const pitch_list = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    return pitch_list[(pitch_list.indexOf(pitch) + 5) % 7]
}