document.addEventListener('DOMContentLoaded', () => {
    window.openPanel = function (type) {
        const panel = document.getElementById('side-panel');
        const overlay = document.getElementById('side-panel-overlay');
        const contentArea = document.getElementById('panel-content-area');
        if (!panel || !overlay || !contentArea) return;

        let html = '';
        if (type === 'sizeGuide') {
            html = `
                <div class="size-guide-header">
                    <h2 class="size-guide-title">SIZE GUIDE</h2>
                    <h3 style="margin-bottom: 2rem; font-size: 1.1rem; font-weight: 800; letter-spacing: 0.05em;">FIND YOUR SIZE</h3>
                    <div class="unit-toggle">
                        <button class="unit-btn active" onclick="switchUnit('in')">IN</button>
                        <button class="unit-btn" onclick="switchUnit('cm')">CM</button>
                    </div>
                </div>
                <table class="size-table" id="size-table-in">
                    <thead><tr><th>SIZE</th><th>CHEST</th><th>WAIST</th></tr></thead>
                    <tbody>
                        <tr style="background:#f9f9f9;"><td><strong>XS</strong></td><td>37</td><td>29.5</td></tr>
                        <tr><td><strong>S</strong></td><td>39</td><td>31.5</td></tr>
                        <tr style="background:#f9f9f9;"><td><strong>M</strong></td><td>41</td><td>33.5</td></tr>
                        <tr><td><strong>L</strong></td><td>43</td><td>35.5</td></tr>
                        <tr style="background:#f9f9f9;"><td><strong>XL</strong></td><td>45</td><td>37.5</td></tr>
                        <tr><td><strong>XXL</strong></td><td>47</td><td>39.5</td></tr>
                        <tr style="background:#f9f9f9;"><td><strong>XXXL</strong></td><td>49</td><td>41.5</td></tr>
                    </tbody>
                </table>
                <table class="size-table" id="size-table-cm" style="display:none;">
                    <thead><tr><th>SIZE</th><th>CHEST</th><th>WAIST</th></tr></thead>
                    <tbody>
                        <tr style="background:#f9f9f9;"><td><strong>XS</strong></td><td>94</td><td>75</td></tr>
                        <tr><td><strong>S</strong></td><td>99</td><td>80</td></tr>
                        <tr style="background:#f9f9f9;"><td><strong>M</strong></td><td>104</td><td>85</td></tr>
                        <tr><td><strong>L</strong></td><td>109</td><td>90</td></tr>
                        <tr style="background:#f9f9f9;"><td><strong>XL</strong></td><td>114</td><td>95</td></tr>
                        <tr><td><strong>XXL</strong></td><td>119</td><td>100</td></tr>
                        <tr style="background:#f9f9f9;"><td><strong>XXXL</strong></td><td>124</td><td>105</td></tr>
                    </tbody>
                </table>
            `;
        } else if (type === 'empty') {
            html = `
                <div style="text-align: center; margin-top: 5rem;">
                    <h2 class="size-guide-title" style="color:var(--text-secondary);">CONTENT PENDING</h2>
                </div>
            `;
        }

        contentArea.innerHTML = html;
        overlay.style.display = 'block';

        setTimeout(() => {
            panel.classList.add('open');
            overlay.classList.add('open');
        }, 10);
    };

    window.switchUnit = function (unit) {
        const btns = document.querySelectorAll('.unit-btn');
        btns.forEach(b => b.classList.remove('active'));
        if (unit === 'in') {
            if (btns.length > 0) btns[0].classList.add('active');
            const inTable = document.getElementById('size-table-in');
            const cmTable = document.getElementById('size-table-cm');
            if (inTable) inTable.style.display = 'table';
            if (cmTable) cmTable.style.display = 'none';
        } else {
            if (btns.length > 1) btns[1].classList.add('active');
            const inTable = document.getElementById('size-table-in');
            const cmTable = document.getElementById('size-table-cm');
            if (inTable) inTable.style.display = 'none';
            if (cmTable) cmTable.style.display = 'table';
        }
    };

    window.closePanel = function () {
        const panel = document.getElementById('side-panel');
        const overlay = document.getElementById('side-panel-overlay');
        if (panel) panel.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        setTimeout(() => {
            if (overlay) overlay.style.display = 'none';
        }, 300);
    };
});
