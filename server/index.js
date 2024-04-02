
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.listen(3002, ()=>{
    console.log('Server is running on port 3002')
})


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'business',
})

function logAction(user_id, action_description) {
    return new Promise((resolve, reject) => {
        const SQL = 'INSERT INTO audit_log (user_id, action_description, action_date) VALUES (?, ?, NOW())';
        const values = [user_id, action_description];

        db.query(SQL, values, (err, results) => {
            if (err) {
                console.error('Error al registrar la acción:', err);
                reject(err);
            } else {
                console.log('Acción registrada con éxito');
                resolve(results);
            }
        });
    });
}

app.post('/register', (req, res)=>{
    const sentEmail = req.body.Email
    const sentUserName = req.body.UserName
    const sentPassword = req.body.Password

    const SQL = 'INSERT INTO users (email, username, password, role) VALUES (?,?,?,?)'
    const Values = [sentEmail, sentUserName, sentPassword, 'vendor']

    db.query(SQL, Values, (err, results)=>{
        if(err){
            res.send(err)
        }
        else{
            console.log('Usuario creado con exito!')
            res.send({message: 'Usuario agregado con exito!'})
        }
    })
})

app.post('/login', (req, res)=>{
    const sentLoginUserName = req.body.LoginUserName
    const sentLoginPassword = req.body.LoginPassword
    
    const SQL = 'SELECT * FROM users WHERE username = ? && password = ?' 
    const Values = [sentLoginUserName, sentLoginPassword]

    db.query(SQL, Values, (err, results)=>{
        if(err){
            res.send({error: err})
        }
        if(results.length > 0) {
            
            res.send({success: true, userRole: results[0].role})
            console.log('Coincidee!')
        }
        else{
            res.send({message: 'Las credenciales no coinciden'})
        }
    })
})

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.send(err);
        } else {
            console.log(results)
            res.send(results);
        }
    });
});

app.post('/users/updateRole', (req, res) => {
    const userId = req.body.userId;
    const newRole = req.body.newRole;

    const SQL = 'UPDATE users SET role = ? WHERE user_id = ?';
    const values = [newRole, userId];

    db.query(SQL, values, (err, results) => {
        if (err) {
            res.send({ success: false, error: err });
        } else {
            res.send({ success: true });
            logAction(userId, `El rol del usuario ${userId} ha sido actualizado a ${newRole}.`);
        }
    });
});
app.post('/users/delete', (req, res) => {
    const userId = req.body.userId;

    // Comprobamos si el usuario tiene registros asociados
    const SQL1 = 'SELECT COUNT(*) as count FROM sales WHERE user_id = ?';
    db.query(SQL1, [userId])
        .then(results => {
            const count = results[0].count;
            if (count === 0) {
                // Eliminamos directamente al usuario si no tiene registros asociados
                const SQL4 = 'DELETE FROM users WHERE user_id = ?';
                db.query(SQL4, [userId])
                    .then(() => {
                        res.send({ success: true });
                    })
                    .catch(err => {
                        console.error(err);
                        res.send({ success: false, error: err });
                    });
            } else {
                // Si el usuario tiene registros asociados, eliminamos los productos relacionados con cada venta
                const SQL2 = 'DELETE FROM sale_products WHERE sale_id IN (SELECT sale_id FROM sales WHERE user_id = ?)';
                db.query(SQL2, [userId])
                    .then(() => {
                        // Luego, eliminamos las ventas del usuario
                        const SQL3 = 'DELETE FROM sales WHERE user_id = ?';
                        db.query(SQL3, [userId])
                            .then(() => {
                                // Finalmente, eliminamos al usuario
                                const SQL4 = 'DELETE FROM users WHERE user_id = ?';
                                db.query(SQL4, [userId])
                                    .then(() => {
                                        res.send({ success: true });
                                        logAction(userId, `El usuario ${userId} y sus ventas asociadas han sido eliminados.`);
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        res.send({ success: false, error: err });
                                    });
                            })
                            .catch(err => {
                                console.error(err);
                                res.send({ success: false, error: err });
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        res.send({ success: false, error: err });
                    });
            }
        })
        .catch(err => {
            console.error(err);
            res.send({ success: false, error: err });
        });
});


app.get('/productinventory', (req, res) => {
    db.query('SELECT * FROM productinventory', (err, results) => {
        if (err) {
            res.send(err);
        } else {
            console.log(results)
            res.send(results);
        }
    });
});

app.post('/productinventory/delete', (req, res) => {
    const product_id = req.body.product_id;
    const quantity_in_stock = req.body.quantity_in_stock
    const SQL = 'DELETE FROM productinventory WHERE product_id = ? AND quantity_in_stock = ?';
    const values = [product_id, quantity_in_stock];

    db.query(SQL, values, (err, results) => {
        if (err) {
            res.send({ success: false, error: err });
        } else {
            res.send({ success: true });
        }
    });
});

app.post('/productinventory/update', (req, res) => {
    const { product_id, product_name, description, quantity_in_stock, price, entry_date } = req.body;
    const is_entry = 1;
    const SQL = 'UPDATE ProductInventory SET product_name = ?, description = ?, quantity_in_stock = ?, price = ?, entry_date = ?, is_entry = ? WHERE product_id = ?';
    const values = [product_name, description, quantity_in_stock, price, entry_date, is_entry, product_id];

    db.query(SQL, values, (err, results) => {
        if (err) {
            res.send({ success: false, error: err });
        } else {
            res.send({ success: true });
        }
    });
});

app.post('/productinventory/add', (req, res) => {
    const { product_name, description, quantity_in_stock, price, entry_date } = req.body;
    const is_entry = 1;
    const SQL = 'INSERT INTO ProductInventory (product_name, description, quantity_in_stock, price, entry_date, is_entry) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [product_name, description, quantity_in_stock, price, entry_date, is_entry];

    db.query(SQL, values, (err, results) => {
        if (err) {
            res.send({ success: false, error: err });
        } else {
            res.send({ success: true });
        }
    });
});

app.get('/ventas', (req, res) => {
    db.query('SELECT * FROM saleproduct', (err, results) => {
        if (err) {
            res.send(err);
        } else {
            console.log(results)
            res.send(results);
        }
    });
});

app.post('/ventas/delete', (req, res) => {
    const saleId = req.body.saleId;
    const productId = req.body.productId;

    const SQL = 'DELETE FROM saleproduct WHERE sale_id = ? AND product_id = ?';
    const values = [saleId, productId];

    db.query(SQL, values, (err, results) => {
        if (err) {
            res.send({ success: false, error: err });
        } else {
            res.send({ success: true });
        }
    });
});

app.post('/ventas/update', (req, res) => {
    const { sale_id, user_id, product_id, quantity_sold, sale_date } = req.body;

    const SQL = 'UPDATE saleproduct SET user_id = ?, product_id = ?, quantity_sold = ?, sale_date = ? WHERE sale_id = ?';
    const values = [user_id, product_id, quantity_sold, sale_date, sale_id];

    db.query(SQL, values, (err, results) => {
        if (err) {
            res.send({ success: false, error: err });
        } else {
            logAction(user_id, `El usuario ${user_id} actualizó la venta ${sale_id}`);
            const SQL_UPDATE = 'UPDATE productinventory SET quantity_in_stock = quantity_in_stock - ? WHERE product_id = ?';
            db.query(SQL_UPDATE, [quantity_sold, product_id], (err, results) => {
                if (err) {
                    res.send({ success: false, error: err });
                } else {
                    res.send({ success: true });
                }
            });
        }
    });
});

app.post('/ventas/add', (req, res) => {
    const { user_id, product_id, quantity_sold, sale_date } = req.body;

    const SQL_CHECK = 'SELECT quantity_in_stock FROM productinventory WHERE product_id = ?';
    db.query(SQL_CHECK, [product_id], (err, results) => {
        if (err) {
            res.send({ success: false, error: err });
        } else {
            if (quantity_sold > results[0].quantity_in_stock) {
                res.send({ success: false, error: 'La cantidad vendida excede la cantidad disponible en el inventario.' });
            } else {
                logAction(user_id, `El usuario ${user_id} agregó la venta ${sale_id}`);
                const SQL = 'INSERT INTO saleproduct (user_id, product_id, quantity_sold, sale_date) VALUES (?, ?, ?, ?)';
                const values = [user_id, product_id, quantity_sold, sale_date];

                db.query(SQL, values, (err, results) => {
                    if (err) {
                        res.send({ success: false, error: err });
                    } else {
                        const SQL_UPDATE = 'UPDATE productinventory SET quantity_in_stock = quantity_in_stock - ? WHERE product_id = ?';
                        db.query(SQL_UPDATE, [quantity_sold, product_id], (err, results) => {
                            if (err) {
                                res.send({ success: false, error: err });
                            } else {
                                res.send({ success: true });
                            }
                        });
                    }
                });
            }
        }
    });
});

app.get('/auditoria', (req, res) => {
    db.query('SELECT * FROM audit_log', (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
});
app.post('/logout', (req, res) => {
    res.send({ success: true });
});