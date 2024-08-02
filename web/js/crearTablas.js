document.addEventListener('DOMContentLoaded', function () {
    const plusButton = document.getElementById('plus');
    const lessButton = document.getElementById('less');
    const columnsContainer = document.getElementById('columns-container');

    plusButton.addEventListener('click', function (e) {
        e.preventDefault();

        const newRow = document.createElement('div');
        newRow.className = 'row';
        newRow.innerHTML = `
            <label for="column-name">Column Name</label>
            <input type="text" class="column-name" name="column-name[]" placeholder="id_usu" required>

            <label for="datatype">Datatype</label>
            <input type="text" class="datatype" name="datatype[]" placeholder="INT" required> 
            
            <label>Constraints:</label>
            <label for="pk">PK</label>
            <input type="checkbox" class="pk" name="pk[]">

            <label for="nn">NN</label>
            <input type="checkbox" class="nn" name="nn[]">

            <label for="fk">FK</label>
            <input type="checkbox" class="fk" name="fk[]">
        `;

        columnsContainer.appendChild(newRow);
    });

    lessButton.addEventListener('click', function (e) {
        e.preventDefault();
        
        const rows = columnsContainer.getElementsByClassName('row');
        if (rows.length > 1) {
            columnsContainer.removeChild(rows[rows.length - 1]);
        }
    });
});
