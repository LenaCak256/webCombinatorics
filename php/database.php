<?php
$mysqli = new mysqli('localhost:3306', 'kombinatorika', 'MariaTerezia123', 'kombinatorika');
if ($mysqli->connect_errno) {
    echo '<p>Nepodarilo sa spojiť s databázou!</p>';
} else {
    $mysqli->query("SET CHARACTER SET 'utf8'");
    echo '<p>Oke!</p>';
}

if (!$mysqli->connect_errno) {
    $sql = "SELECT * FROM users";
	if ($result = $mysqli->query($sql)) {
		while ($row = $result->fetch_assoc()) {
			echo '<p>' . $row['name'] . ' ' . $row['surname'] . '</p>';
		}
		$result->free();
	} else {
		echo '<p>Nepodarilo sa získať údaje z databázy</p>';
	}
}


