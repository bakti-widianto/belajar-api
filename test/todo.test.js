'use strict'

const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app');
const Todo = require("../models/todo");

const should = chai.should();
chai.use(chaiHTTP);

describe('todos', function () {

    // saya bersihkan dulu document di collection todo
    Todo.collection.drop();

    // setiap sebelum melakukan test saya tambahkan satu data "belajar TDD"
    beforeEach(function (done) {
        let todo = new Todo({
            task: "belajar TDD"
        });

        todo.save(function (err) {
            done();
        })
    });

    // setiap habis melakukan test saya kosongkan data di collection todo
    afterEach(function (done) {
        Todo.collection.drop();
        done();
    });

    it('seharusnya mendapatkan semua daftar tugas yang ada di table TODO dengan metode GET', function (done) {
        chai.request(server)
            .get('/api/todos')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.error.should.equal(false);
                res.body.data.should.be.a('array');
                res.body.data[0].should.have.property('_id');
                res.body.data[0].should.have.property('task');
                res.body.data[0].should.have.property('complete');
                res.body.data[0].task.should.equal('belajar TDD');
                res.body.data[0].complete.should.equal(false);
                done()
            })
    })

    it('seharusnya menambahkan satu todo dengan metode POST', function (done) {
        chai.request(server)
            .post('/api/todos')
            .send({ 'task': 'Belajar jadi pintar' })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.error.should.equal(false);
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('task');
                res.body.data.should.have.property('complete');
                res.body.data.should.have.property('_id');
                res.body.data.task.should.equal('Belajar jadi pintar');
                res.body.data.complete.should.equal(false);
                done();
            });
    });

    it('seharusnya bisa memperbaharui melalui path /api/todos/<id> PUT', function (done) {
        chai.request(server)
            .get('/api/todos')
            .end(function (err, res) {
                chai.request(server)
                    .put('/api/todos/' + res.body.data[0]._id)
                    .send({ 'task': res.body.data[0].task, 'complete': true })
                    .end(function (error, response) {
                        response.should.have.status(201);
                        response.should.be.json;
                        res.body.error.should.equal(false);
                        response.body.data.should.be.a('object');
                        response.body.data.should.have.property('task');
                        response.body.data.should.have.property('complete');
                        response.body.data.should.have.property('_id');
                        response.body.data.task.should.equal('belajar TDD');
                        response.body.data.complete.should.equal(true);
                        done();
                    });
            });
    });

    it('seharusnya menghapus satu todo id path /api/todos/<id> DELETE', function (done) {
        chai.request(server)
            .get('/api/todos')
            .end(function (err, res) {
                chai.request(server)
                    .delete('/api/todos/' + res.body.data[0]._id)
                    .end(function (error, response) {
                        response.should.have.status(201);
                        response.should.be.json;
                        response.body.data.should.be.a('object');
                        response.body.data.should.have.property('task');
                        response.body.data.should.have.property('complete');
                        response.body.data.should.have.property('_id');
                        response.body.data.task.should.equal('belajar TDD');
                        done();
                    });
            });
    });

})