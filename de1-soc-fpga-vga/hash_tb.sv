module tb_rtl_hash();
// Your testbench goes here.
    logic clock = 1'b1;
    logic resetn, waitrequest, read, write;
    logic [3:0] address;
    logic [31:0] readdata, writedata;

    // instantiate hash dut
    hash dut(.*);

    always #5 clock = ~clock; // create a clock with period 10

    /**
    * @brief Runs a call to hash(word1, word0)
    *
    * Task will print to console and assert if anything has gone wrong
    *
    * @param word1  value to hash word1
    * @param word0  value to hash word0
    */
    task test_hash;
        input [31:0] word1, word0;
        #10;
        // act as master (CPU) and start hash module word0
        address = 4'd1; write = 1'b1; read = 1'b0;
        writedata = word0;
        #10;
        // act as master (CPU) and start hash module word1
        address = 4'd2; write = 1'b1; read = 1'b0;
        writedata = word1;
        #10;
        // start hash module by writing to word 0
        address = 4'd0; write = 1'b1; read = 1'b0;
        writedata = 32'd1;
        // module should be started now
        #10;
        write = 1'b0; read = 1'b1;

        // wait for module to be done
        //while(waitrequest != 1'b0) begin
        //    #10;
        //end
        @(negedge waitrequest);

        address = 4'd3;
        #10;

        $display("SHA-256 of word1: %x, word0 %x", word1, word0);
        $display("SHA-256 D7: %x", readdata);

        address = 4'd4;
        #10;

        $display("SHA-256 D6: %x", readdata);
        address = 4'd5;
        #10;

        $display("SHA-256 D5: %x", readdata);
        address = 4'd6;
        #10;

        $display("SHA-256 D4: %x", readdata);
        address = 4'd7;
        #10;

        $display("SHA-256 D3: %x", readdata);
        address = 4'd8;
        #10;

        $display("SHA-256 D2: %x", readdata);
        address = 4'd9;
        #10;

        $display("SHA-256 D1: %x", readdata);
        address = 4'd10;
        #10;

        $display("SHA-256 D0: %x", readdata);
    endtask

    initial begin
        #10;
        // reset module
        resetn = 1'b0;
        #10;
        resetn = 1'b1;

        // testing hash module
        test_hash(32'h2, 32'h1);
        test_hash(32'h0, 32'h0);
        //test_dot(32'h0, 32'h0a800000, 32'd0);

        //force dut.state = 4'b0000;
        //slave_write = 1'b1;
        //slave_address = 4'd6;
        //#10;
        //slave_write = 1'b0;
        //slave_read = 1'b1; slave_address = 1'd1;
        //#10;
        //slave_read = 1'b0;
        //force dut.state = 4'b0001;
        //force dut.master_waitrequest = 1'b1;
        //#10;
        //force dut.state = 4'b0010;
        //force dut.master_waitrequest = 1'b1;
        //#10;
        //force dut.state = 4'b1111;
        //#10;
        //release dut.state;
        //release dut.master_waitrequest;

        $stop;
    end

endmodule: tb_rtl_hash
