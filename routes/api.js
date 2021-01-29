const express = require('express')
const router = express.Router()
router.get('/connect',(req,res)=>{
    res.send('Ok')
})
module.exports = router