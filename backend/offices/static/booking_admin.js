document.addEventListener("DOMContentLoaded", function () {
    const officeSelect = document.getElementById("id_office");
    const roomSelect = document.getElementById("id_room");
    const workplaceSelect = document.getElementById("id_workplace");

    officeSelect.addEventListener("change", function () {
        const officeId = this.value;
        roomSelect.innerHTML = '<option value="">------</option>';
        workplaceSelect.innerHTML = '<option value="">------</option>';

        if (officeId) {
            fetch(`/api/get_rooms/${officeId}/`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(room => {
                        const option = document.createElement("option");
                        option.value = room.id;
                        option.textContent = `Room ${room.number}`;
                        roomSelect.appendChild(option);
                    });
                });
        }
    });

    roomSelect.addEventListener("change", function () {
        const roomId = this.value;
        workplaceSelect.innerHTML = '<option value="">------</option>';

        if (roomId) {
            fetch(`/api/get_workplaces/${roomId}/`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(workplace => {
                        const option = document.createElement("option");
                        option.value = workplace.id;
                        option.textContent = `Workplace ${workplace.number}`;
                        workplaceSelect.appendChild(option);
                    });
                });
        }
    });
});