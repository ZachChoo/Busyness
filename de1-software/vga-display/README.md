## VGA Display with HAGL and HAGL HAL
### How to run examples
Navigate to examples/ directory and run `make shapes` or `make palette` and then run `./shapes` or `./palette` with the `video.ko` kernel module loaded
Do `lsmod` to check that the `video` kernel module is loaded
If VGA display is plugged into DE1-SoC, then shapes or a color palette should be displayed on the screen

### Example output
This is an example of what is displayed on the VGA display after running `./shapes`
![Shapes VGA display](./pictures/shapes.png)
