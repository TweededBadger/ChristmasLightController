<?php

class Dbmodel extends CI_Model {
    public function __construct()
    {
        $this->load->database();
        $this->load->helper('string');
    }
    
    public function test() {
        $this->db->select('*');
        $this->db->limit(100);
        $result = $this->db->get('levels');
        return $result->result();
    }
    
    public function setlights($str) {
        $data = array();
        $data['value'] = $str;
        $this->db->where('name', "current");
        $this->db->update('data', $data); 
    }
    
}
?>