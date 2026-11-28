#!/usr/bin/env python3
"""CPU Real-ESRGAN x4 upscale (Python). Usage: run-esrgan.py in.png out.png"""
import sys

def main():
    if len(sys.argv) < 3:
        print("usage: run-esrgan.py in out", file=sys.stderr)
        sys.exit(2)
    inp, out = sys.argv[1], sys.argv[2]
    try:
        import torchvision.transforms.functional as _f
        sys.modules["torchvision.transforms.functional_tensor"] = _f
        from realesrgan import RealESRGANer
        from basicsr.archs.rrdbnet_arch import RRDBNet
        import cv2
    except ImportError as e:
        print(f"import-error: {e}", file=sys.stderr)
        sys.exit(3)

    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
    upsampler = RealESRGANer(
        scale=4,
        model_path="https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth",
        model=model,
        tile=256,
        tile_pad=10,
        pre_pad=0,
        half=False,
    )
    img, _ = cv2.imread(inp, cv2.IMREAD_UNCHANGED), None
    if img is None:
        print("read-failed", file=sys.stderr)
        sys.exit(4)
    if img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    elif img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
    out_img, _ = upsampler.enhance(img, outscale=4)
    cv2.imwrite(out, out_img)

if __name__ == "__main__":
    main()