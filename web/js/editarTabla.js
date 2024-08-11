document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-column');
    const columnsContainer = document.getElementById('columns-container');

    // // Deshabilitar los campos de la primera fila y ocultar el botón de eliminar
    // const firstRow = columnsContainer.querySelector('.row');
    // if (firstRow) {
    //     const inputsToDisable = firstRow.querySelectorAll('.column-name, .datatype, .pk, .nn');
    //     inputsToDisable.forEach(input => input.disabled = true);
        
    //     const removeButton = firstRow.querySelector('.remove-column');
    //     if (removeButton) {
    //         removeButton.id = 'first-remove-button'; // Asignar un ID al primer botón
    //         removeButton.disabled = true; // Deshabilitar el botón
    //     }
    // }

    // const pkCheckboxes = columnsContainer.querySelectorAll('.pk');

    // function handlePKCheckboxChange() {
    //     let pkChecked = false;
        
    //     // Verificar si ya hay un checkbox de PK seleccionado
    //     pkCheckboxes.forEach((checkbox) => {
    //         if (checkbox.checked) {
    //             pkChecked = true;
    //         }
    //     });

    //     // Deshabilitar o habilitar los checkboxes según el estado del PK
    //     pkCheckboxes.forEach((checkbox) => {
    //         if (pkChecked && !checkbox.checked) {
    //             checkbox.disabled = true;
    //         } else {
    //             checkbox.disabled = false;
    //         }
    //     });
    // }

    // // Verificar el estado inicial al cargar la página
    // handlePKCheckboxChange();

    // // Asignar el evento change a cada checkbox de PK
    // pkCheckboxes.forEach((checkbox) => {
    //     checkbox.addEventListener('change', function () {
    //         handlePKCheckboxChange();
    //     });
    // });

    // function updateFieldNames() {
    //     const rows = columnsContainer.querySelectorAll('.row');
    //     rows.forEach((row, index) => {
    //         const columnNameInput = row.querySelector('.column-name');
    //         const datatypeInput = row.querySelector('.datatype');
    //         const nnCheckbox = row.querySelector('.nn');
    //         const pkCheckbox = row.querySelector('.pk');

    //         columnNameInput.name = `columnName[${index}]`;
    //         datatypeInput.name = `datatype[${index}]`;
    //         if (nnCheckbox) nnCheckbox.name = `nn[${index}]`;
    //         if (pkCheckbox) pkCheckbox.name = `pk[${index}]`;
    //     });
    // }

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
        updateFieldNames();
        handlePKCheckboxChange();
    });

    columnsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-column')) {
            e.preventDefault();
            const row = e.target.closest('.row');
            columnsContainer.removeChild(row);
            updateFieldNames();
            handlePKCheckboxChange();
        }
    });

    // Capturar el evento de envío del formulario para depuración
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevenir el envío por defecto

        // Aquí puedes inspeccionar los datos del formulario antes de enviar
        console.log(new FormData(form));

        // Luego, si todo está bien, envía el formulario
        form.submit();
    });
});
