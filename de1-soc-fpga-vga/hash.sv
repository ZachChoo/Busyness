module hash(input logic clock, input logic resetn,
    output logic waitrequest,
    input logic [3:0] address,
    input logic read, output logic [31:0] readdata,
    input logic write, input logic [31:0] writedata);

    // Define states
    `define S0  5'b00000
    `define S1  5'b00001
    `define S2  5'b00010
    `define S3  5'b00011
    `define S4  5'b00100
    `define S5  5'b00101
    `define S6  5'b00110
    `define S7  5'b00111
    `define S8  5'b01000
    `define S9  5'b01001
    `define S10 5'b01010
    `define S11 5'b01011
    `define S12 5'b01100
    `define S13 5'b01101
    `define S14 5'b01110
    `define S15 5'b01111
    `define S16 5'b10000
    `define S17 5'b10001
    `define S18 5'b10010
    `define S19 5'b10011
    `define S20 5'b10100
    `define S21 5'b10101
    `define S22 5'b10111

    // internal signals
    logic [4:0] state;
    logic [31:0] saved_input_val_w0, saved_input_val_w1, sha256_input;

    logic [31:0] sha_core_output;
    logic [31:0] sha_output_d7;
    logic [31:0] sha_output_d6;
    logic [31:0] sha_output_d5;
    logic [31:0] sha_output_d4;
    logic [31:0] sha_output_d3;
    logic [31:0] sha_output_d2;
    logic [31:0] sha_output_d1;
    logic [31:0] sha_output_d0;

    // signals from SHA 256 core
    logic [2:0] cmd_input; // from hash module to sha256 core
    logic cmd_write_enable; // from has module to sha256 core
    logic [3:0] cmd_output; // from sha256 core to hash module

    // combinational always block to set signals that shouldnt be FFs
    always @(*) begin
        casex({resetn, state})
            // if reset is asserted, set waitreqest to 1
            {1'b0, 4'bx}  : {waitrequest} <= {1'b1};
            // if reset not asserted, set waitrequest based on state
            {1'b1, `S0}   : {waitrequest} <= {1'b0};
            {1'b1, `S1}   : {waitrequest} <= {1'b1};
            {1'b1, `S2}   : {waitrequest} <= {1'b1};
            {1'b1, `S3}   : {waitrequest} <= {1'b1};
            {1'b1, `S4}   : {waitrequest} <= {1'b1};
            {1'b1, `S5}   : {waitrequest} <= {1'b1};
            {1'b1, `S6}   : {waitrequest} <= {1'b1};
            {1'b1, `S7}   : {waitrequest} <= {1'b1};
            {1'b1, `S8}   : {waitrequest} <= {1'b1};
            {1'b1, `S9}   : {waitrequest} <= {1'b1};
            {1'b1, `S10}  : {waitrequest} <= {1'b1};
            {1'b1, `S11}  : {waitrequest} <= {1'b1};
            {1'b1, `S12}  : {waitrequest} <= {1'b1};
            {1'b1, `S13}  : {waitrequest} <= {1'b1};
            {1'b1, `S13}  : {waitrequest} <= {1'b1};
            {1'b1, `S14}  : {waitrequest} <= {1'b1};
            {1'b1, `S15}  : {waitrequest} <= {1'b1};
            {1'b1, `S16}  : {waitrequest} <= {1'b1};
            {1'b1, `S17}  : {waitrequest} <= {1'b1};
            {1'b1, `S18}  : {waitrequest} <= {1'b1};
            {1'b1, `S19}  : {waitrequest} <= {1'b1};
            {1'b1, `S20}  : {waitrequest} <= {1'b1};
            {1'b1, `S21}  : {waitrequest} <= {1'b1};
            {1'b1, `S22}  : {waitrequest} <= {1'b1};
            default       : {waitrequest} <= {1'b1};
        endcase
    end

    // SHA-256 core from opencores
    // https://opencores.org/websvn/filedetails?repname=sha_core&path=%2Fsha_core%2Ftrunk%2Fbench%2Ftest_sha256.v
    sha256 sha256core(
        .clk_i(clock),
        .rst_i(~resetn),
        .text_i(sha256_input),
        .text_o(sha_core_output),
        .cmd_i(cmd_input),
        .cmd_w_i(cmd_write_enable),
        .cmd_o(cmd_output)
	);


    // output logic and next state logic combinational always block
    always_ff @(posedge clock) begin
        if(resetn == 1'b0) begin
            state <= `S0;
            saved_input_val_w0 <= 32'd0;
            saved_input_val_w1 <= 32'd0;
            sha_output_d7 <= 32'd0;
            sha_output_d6 <= 32'd0;
            sha_output_d5 <= 32'd0;
            sha_output_d4 <= 32'd0;
            sha_output_d3 <= 32'd0;
            sha_output_d2 <= 32'd0;
            sha_output_d1 <= 32'd0;
            sha_output_d0 <= 32'd0;
        end else
            case(state)
                // State 0 sets up accelerator based on input values
                // and returns result if asked
                `S0: begin
                    state <= `S0;
                    // If writing, check address and save relevant data
                    if(write == 1'b1) begin
                        // A write to word 0 starts hash module accelerator
                        if(address == 4'd0) begin
                            state <= `S1;
                        end
                        else if(address == 4'd1) begin
                            // Word 1 is the input value word0 to be hashed
                            saved_input_val_w0 <= writedata;
                            sha256_input <= writedata;
                        end
                        else if(address == 4'd2) begin
                            // Word 2 is the input value word1 to be hashed
                            saved_input_val_w1 <= writedata;
                        end
                    end
                    else if(read == 1'b1) begin
                        // A read from word 2 will return hashed value byte 0
                        if(address == 4'd3) begin
                            readdata <= sha_output_d7;
                        end
                        else if (address == 4'd4) begin
                            readdata <= sha_output_d6;
                        end
                        else if (address == 4'd5) begin
                            readdata <= sha_output_d5;
                        end
                        else if (address == 4'd6) begin
                            readdata <= sha_output_d4;
                        end
                        else if (address == 4'd7) begin
                            readdata <= sha_output_d3;
                        end
                        else if (address == 4'd8) begin
                            readdata <= sha_output_d2;
                        end
                        else if (address == 4'd9) begin
                            readdata <= sha_output_d1;
                        end
                        else if (address == 4'd10) begin
                            readdata <= sha_output_d0;
                        end
                    end
                end
                // State 1 takes care of starting SHA256 module
                // by writing to cmd_input
                `S1: begin
                    // Set to write, and first round for sha256 core
                    cmd_input <= 3'b010;
                    cmd_write_enable <= 1'b1;
                    // saved_input_val has data to be hashed
                    state <= `S2;
                end
                // State 2 takes care of waiting for sha 256 module to be done
                // by polling cmd_output busy bit (bit 4)
                `S2: begin
                    cmd_write_enable <= 1'b0;
                    state <= `S10;
                end
                `S10: begin
                    state <= `S11;
                    sha256_input <= saved_input_val_w1;;
                end
                `S11: begin
                    state <= `S3;
                    sha256_input <= 32'd0;
                end
                `S3: begin
                    if(cmd_output[3] == 1'b1) begin
                        // sha 256 core is still busy, keep waiting
                        state <= `S3;
                    end
                    else begin
                        state <= `S4;
                    end
                end
                // State 3 takes care of setting to internal round to sha 256 core
                `S4: begin
                    // Set to internal round, and write
                    cmd_input <= 3'b110;
                    cmd_write_enable <= 1'b1;
                    // Go to next state
                    state <= `S5;
                end
                // State 4 waits for cmd_output busy bit to be done
                `S5: begin
                    cmd_write_enable <= 1'b0;
                    sha256_input <= saved_input_val_w0;
                    state <= `S12;
                end
                `S12: begin
                    sha256_input <= saved_input_val_w1;
                    state <= `S13;
                end
                `S13: begin
                    sha256_input <= 32'd0;
                    state <= `S6;
                end
                `S6: begin
                    if(cmd_output[3] == 1'b1) begin
                        // sha 256 core is still busy, keep waiting
                        state <= `S6;
                    end
                    else begin
                        state <= `S7;
                    end
                end
                `S7: begin
                    // Set to read
                    cmd_input <= 3'b001;
                    cmd_write_enable <= 1'b1;
                    state <= `S8;
                end
                `S8: begin
                    cmd_write_enable <= 1'b0;
                    state <= `S9;
                end
                `S9: begin
                    state <= `S22;
                end
                `S22: begin
                    state <= `S19;
                end
                // Data should be ready here
                // Read out 256 bits returned
                `S19: begin
                    sha_output_d7 <= sha_core_output;
                    state <= `S20;
                end
                `S20: begin
                    sha_output_d6 <= sha_core_output;
                    state <= `S21;
                end
                `S21: begin
                    sha_output_d5 <= sha_core_output;
                    state <= `S14;
                end
                `S14: begin
                    sha_output_d4 <= sha_core_output;
                    state <= `S15;
                end
                `S15: begin
                    sha_output_d3 <= sha_core_output;
                    state <= `S16;
                end
                `S16: begin
                    sha_output_d2 <= sha_core_output;
                    state <= `S17;
                end
                `S17: begin
                    sha_output_d1 <= sha_core_output;
                    state <= `S18;
                end
                `S18: begin
                    sha_output_d0 <= sha_core_output;
                    state <= `S0;
                    // Serve read for S0 transition
                    if(read == 1'b1) begin
                        // A read from word 2 will return hashed value byte 0
                        if(address == 4'd3) begin
                            readdata <= sha_output_d7;
                        end
                        else if (address == 4'd4) begin
                            readdata <= sha_output_d6;
                        end
                        else if (address == 4'd5) begin
                            readdata <= sha_output_d5;
                        end
                        else if (address == 4'd6) begin
                            readdata <= sha_output_d4;
                        end
                        else if (address == 4'd7) begin
                            readdata <= sha_output_d3;
                        end
                        else if (address == 4'd8) begin
                            readdata <= sha_output_d2;
                        end
                        else if (address == 4'd9) begin
                            readdata <= sha_output_d1;
                        end
                        else if (address == 4'd10) begin
                            // This is d0 output
                            readdata <= sha_core_output;
                        end
                        else begin
                            readdata <= sha_output_d7;
                        end
                    end
                end
                default: begin
                    state <= `S0;
                    saved_input_val_w0 <= 32'd0;
                    saved_input_val_w1 <= 32'd0;
                    sha_output_d7 <= 32'd0;
                    sha_output_d6 <= 32'd0;
                    sha_output_d5 <= 32'd0;
                    sha_output_d4 <= 32'd0;
                    sha_output_d3 <= 32'd0;
                    sha_output_d2 <= 32'd0;
                    sha_output_d1 <= 32'd0;
                    sha_output_d0 <= 32'd0;
                end
            endcase
    end

endmodule: hash
