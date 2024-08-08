document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-column');
    const columnsContainer = document.getElementById('columns-container');

    addButton.addEventListener('click', function (e) {
        e.preventDefault();

        const rowCount = columnsContainer.children.length;
        const newRow = document.createElement('div');
        newRow.className = 'row';
        newRow.innerHTML = `
            <label for="column-name">Column Name</label>
            <input type="text" class="column-name" name="columnName[${rowCount}]" placeholder="nom_..." required>

            <label for="datatype">Datatype</label>
            <input type="text" class="datatype" name="datatype[${rowCount}]" placeholder="INT, Varchar(), Double ..." required>

            <label for="pk">PK</label>
            <input type="checkbox" class="pk" name="pk[${rowCount}]">

            <label for="nn">NN</label>
            <input type="checkbox" class="nn" name="nn[${rowCount}]">

            <button type="button" class="remove-column">Eliminar</button>
        `;

        columnsContainer.appendChild(newRow);
    });

    columnsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-column')) {
            e.preventDefault();
            const row = e.target.closest('.row');
            columnsContainer.removeChild(row);
        }
    });
});
