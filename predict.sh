TEST_DIR=$1
CSV=$2
FRAMES=$3
WEIGHTS_DIR=~/deepfake/deepfake-server/weights

python -W ignore ~/deepfake/deepfake-server/predict_folder.py \
 	--weights-dir $WEIGHTS_DIR \
	--test-dir $TEST_DIR \
 	--output $CSV \
 	--models final_111_DeepFakeClassifier_tf_efficientnet_b7_ns_0_36 \
	--frames $FRAMES

 